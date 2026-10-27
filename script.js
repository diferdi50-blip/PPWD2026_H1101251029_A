$(function () {
    // Mengikuti pengaturan reduced motion dari pengguna.
    jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Event click dan efek slide untuk menu.
    $('#navToggle').on('click', function () {
        $('#navLinks').stop(true, true).slideToggle(200);
    });

    // 2. Tab informasi: mengganti panel berdasarkan data-target.
    $('.tab').on('click', function () {
        const target = $(this).data('target');
        $('.tab').removeClass('active').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');
        $('.tab-pane').stop(true, true).fadeOut(100, function () {
            $('.tab-pane').prop('hidden', true);
            $(target).prop('hidden', false).hide().fadeIn(180);
        });
    });

    // 3. Animasi kartu fitur menggunakan animate().
    $('.feature-card').on('mouseenter', function () {
        $(this).stop().animate({ top: '-5px' }, 120);
    }).on('mouseleave', function () {
        $(this).stop().animate({ top: '0px' }, 120);
    });

    // 4. FAQ dengan slideUp dan slideDown.
    $('.faq-question').on('click', function () {
        const $answer = $(this).next('.faq-answer');
        const open = $answer.is(':visible');
        $('.faq-answer').not($answer).stop(true, true).slideUp(180);
        $('.faq-question').not(this).find('span').text('＋');
        $answer.stop(true, true)[open ? 'slideUp' : 'slideDown'](200);
        $(this).find('span').text(open ? '＋' : '−');
    });

    // 5. Smooth scroll untuk tautan internal.
    $('a[href^="#"]').on('click', function (e) {
        const id = $(this).attr('href');
        const $target = $(id);
        if (id.length < 2 || !$target.length) return;
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: $target.offset().top - 68 }, 400);
        if (window.matchMedia('(max-width: 760px)').matches) {
            $('#navLinks').stop(true, true).slideUp(150);
        }
    });

    // Pesan notifikasi sederhana.
    function showToast(message, error = false) {
        $('#toast').stop(true, true).toggleClass('error-toast', error)
            .text(message).fadeIn(150).delay(2200).fadeOut(250);
    }

    // 6. Aturan khusus nomor WhatsApp.
    $.validator.addMethod('nomorWhatsApp', function (value, element) {
        const number = value.replace(/[\s-]/g, '');
        const digits = number.replace(/\D/g, '').length;
        return this.optional(element) ||
            (/^\+?[0-9]+$/.test(number) && digits >= 10 && digits <= 13);
    }, 'Masukkan nomor WhatsApp yang valid (10–13 digit).');

    // 7. Validasi form menggunakan jQuery Validation Plugin.
    const $form = $('#formPendaftaran');
    $form.validate({
        rules: {
            nama: { required: true, minlength: 3 },
            usia: { required: true, digits: true, min: 15, max: 100 },
            email: { required: true, email: true },
            hp: { required: true, nomorWhatsApp: true },
            instansi: { required: true, minlength: 2 },
            kategori: { required: true },
            sesi: { required: true },
            alasan: { required: true, minlength: 10, maxlength: 500 },
            persetujuan: { required: true }
        },
        messages: {
            nama: 'Nama wajib diisi, minimal 3 karakter.',
            usia: 'Usia harus berupa angka antara 15–100.',
            email: 'Masukkan alamat email yang valid.',
            hp: 'Masukkan nomor WhatsApp yang valid.',
            instansi: 'Asal kampus/instansi wajib diisi.',
            kategori: 'Pilih kategori peserta.',
            sesi: 'Pilih sesi acara.',
            alasan: 'Tuliskan alasan 10–500 karakter.',
            persetujuan: 'Persetujuan wajib dicentang.'
        },
        errorElement: 'label',
        errorClass: 'error',
        highlight: function (element) {
            $(element).addClass('is-error').removeClass('is-valid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-error').addClass('is-valid');
        },
        submitHandler: function (form) {
            // Mengubah data formulir menjadi objek JSON.
            const data = Object.fromEntries(new FormData(form).entries());
            data.persetujuan = $('#persetujuan').is(':checked');
            const jsonData = JSON.stringify(data, null, 2);
            console.log('Data pendaftaran dalam JSON:', jsonData);

            $('#successMessage').prop('hidden', false).hide().slideDown(200);
            showToast('Pendaftaran berhasil divalidasi, ' + data.nama + '!');
            form.reset();
            $form.validate().resetForm();
            $form.find('.is-error, .is-valid').removeClass('is-error is-valid');
            return false; // Simulasi front-end, belum menyimpan ke database.
        }
    });

    // 8. Tombol kembali ke atas dengan efek fade dan animate.
    const $top = $('#backToTop');
    $(window).on('scroll', function () {
        $(this).scrollTop() > 350
            ? $top.stop(true, true).fadeIn(150)
            : $top.stop(true, true).fadeOut(150);
    });
    $top.on('click', function () {
        $('html, body').stop().animate({ scrollTop: 0 }, 400);
    });
});