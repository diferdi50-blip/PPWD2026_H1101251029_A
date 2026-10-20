
$(function () {
    // Menghormati preferensi pengguna untuk mengurangi gerakan.
    jQuery.fx.off = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // 1. MENU NAVIGASI RESPONSIF: slideDown / slideUp
    $('#navToggle').on('click', function () {
        $('#navLinks').stop(true, true).slideToggle(220);
    });

    // 2. TAB INFORMASI: click + fadeIn / fadeOut
    $('.tab').on('click', function () {
        const target = $(this).data('target');

        $('.tab')
            .removeClass('active')
            .attr('aria-selected', 'false');

        $(this)
            .addClass('active')
            .attr('aria-selected', 'true');

        $('.tab-pane:visible').stop(true, true).fadeOut(140, function () {
            $(target).stop(true, true).fadeIn(220);
        });
    });

    // 3. KARTU FITUR: animate saat pointer masuk/keluar
    $('.feature-card')
        .on('mouseenter', function () {
            $(this).stop().animate({ top: '-6px' }, 160);
        })
        .on('mouseleave', function () {
            $(this).stop().animate({ top: '0px' }, 160);
        });

    // 4. FAQ: slideDown / slideUp
    $('.faq-question').on('click', function () {
        const $answer = $(this).next('.faq-answer');
        const isOpen = $answer.is(':visible');

        $('.faq-answer').not($answer).stop(true, true).slideUp(200);
        $('.faq-question').not(this).find('span').text('＋');

        if (isOpen) {
            $answer.stop(true, true).slideUp(200);
            $(this).find('span').text('＋');
        } else {
            $answer.stop(true, true).slideDown(240);
            $(this).find('span').text('−');
        }
    });

    // 5. SMOOTH SCROLL untuk link internal
    $('a[href^="#"]').on('click', function (e) {
        const href = $(this).attr('href');

        if (!href || href.length < 2) {
            return;
        }

        const $target = $(href);

        if (!$target.length) {
            return;
        }

        e.preventDefault();

        $('html, body').stop(true).animate({
            scrollTop: $target.offset().top - 72
        }, 550);

        // Tutup menu mobile setelah link dipilih.
        if (window.matchMedia('(max-width: 720px)').matches) {
            $('#navLinks').stop(true, true).slideUp(180);
        }
    });

    // Fungsi notifikasi
    function showToast(message, error = false) {
        $('#toast')
            .stop(true, true)
            .toggleClass('error-toast', error)
            .text(message)
            .fadeIn(200)
            .delay(2800)
            .fadeOut(300);
    }

    // Custom rule nomor WhatsApp: 10–13 digit angka.
    $.validator.addMethod(
        'nomorWhatsApp',
        function (value, element) {
            if (this.optional(element)) {
                return true;
            }

            const normalized = value.replace(/[\s-]/g, '');
            const digitCount = normalized.replace(/\D/g, '').length;

            return /^[+0-9]+$/.test(normalized) &&
                digitCount >= 10 &&
                digitCount <= 13;
        },
        'Masukkan nomor WhatsApp yang valid (10-13 digit).'
    );

    // VALIDASI FORM menggunakan jQuery Validation Plugin
    const validator = $('#formPendaftaran').validate({
        rules: {
            nama: {
                required: true,
                minlength: 3
            },

            usia: {
                required: true,
                digits: true,
                min: 15,
                max: 100
            },

            email: {
                required: true,
                email: true
            },

            hp: {
                required: true,
                nomorWhatsApp: true
            },

            instansi: {
                required: true,
                minlength: 2
            },

            kategori: {
                required: true
            },

            sesi: {
                required: true
            },

            alasan: {
                required: true,
                minlength: 10,
                maxlength: 500
            },

            persetujuan: {
                required: true
            }
        },

        messages: {
            nama: {
                required: 'Nama lengkap wajib diisi.',
                minlength: 'Nama minimal 3 karakter.'
            },

            usia: {
                required: 'Usia wajib diisi.',
                digits: 'Usia harus berupa angka bulat.',
                min: 'Usia peserta minimal 15 tahun.',
                max: 'Periksa kembali usia yang dimasukkan.'
            },

            email: {
                required: 'Alamat email wajib diisi.',
                email: 'Masukkan format email yang valid.'
            },

            hp: {
                required: 'Nomor WhatsApp wajib diisi.'
            },

            instansi: {
                required: 'Asal kampus atau instansi wajib diisi.',
                minlength: 'Isi minimal 2 karakter.'
            },

            kategori: {
                required: 'Silakan pilih kategori peserta.'
            },

            sesi: {
                required: 'Silakan pilih sesi yang diminati.'
            },

            alasan: {
                required: 'Bagian ini wajib diisi.',
                minlength: 'Tuliskan minimal 10 karakter.',
                maxlength: 'Jawaban maksimal 500 karakter.'
            },

            persetujuan: {
                required: 'Persetujuan wajib dicentang.'
            }
        },

        errorElement: 'label',
        errorClass: 'error',

        errorPlacement: function (error, element) {
            if (element.attr('name') === 'persetujuan') {
                error.insertAfter(element.closest('.checkbox-label'));
            } else {
                error.insertAfter(element);
            }
        },

        highlight: function (element) {
            $(element)
                .addClass('is-error')
                .removeClass('is-valid');
        },

        unhighlight: function (element) {
            $(element)
                .removeClass('is-error')
                .addClass('is-valid');
        },

        submitHandler: function (form) {
            const participantName = $('#nama').val().trim();

            $('#successMessage')
                .stop(true, true)
                .slideDown(250);

            showToast(
                'Pendaftaran berhasil divalidasi, ' +
                participantName + '!',
                false
            );

            // Scroll ke pesan sukses
            $('html, body').stop(true).animate({
                scrollTop: $('#successMessage').offset().top - 120
            }, 550);

            // Ini simulasi front-end, bukan penyimpanan database.
            form.reset();
            validator.resetForm();

            $('#formPendaftaran .is-error, #formPendaftaran .is-valid')
                .removeClass('is-error is-valid');

            return false;
        }
    });

    // Validasi diperbarui ketika pengguna mengubah isi input.
    $('#formPendaftaran input, #formPendaftaran select, #formPendaftaran textarea')
        .on('input change', function () {
            if ($(this).valid()) {
                $(this).removeClass('is-error');
            }
        });

    // 6. TOMBOL KEMBALI KE ATAS: scroll + fade + animate
    const $backToTop = $('#backToTop');

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 400) {
            $backToTop.stop(true, true).fadeIn(180);
        } else {
            $backToTop.stop(true, true).fadeOut(180);
        }
    });

    $backToTop.on('click', function () {
        $('html, body').stop(true).animate({
            scrollTop: 0
        }, 550);
    });
});
