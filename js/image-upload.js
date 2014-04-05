(function () {
    'use strict';

    var $uploaders = $('[data-image-upload]'),
        defaults,
        upload;

    if (! $uploaders.length)
        return;

    defaults = {
        input: null,
        images: null,
        form: null,
        path: null,
        resProp: null
    };

    upload = function() {
        var $this = $(this),
            triggerUpload = function() {
                var data = $this.data('image-upload'),
                    options = $.extend(defaults, data),
                    $input = $(options.input),
                    submitChange = function() {
                        var form = $(options.form)[0],
                            formData,
                            changeImages,
                            getOrigin,
                            ajaxOptions;

                        if (! window.FormData)
                            form.submit();

                        formData = new FormData( form );

                        changeImages = function(res) {
                            var $images = $(options.images),
                                setImage,
                                src;

                            if (typeof res === 'string')
                                res = JSON.parse(res);

                            src = res[options.resProp];

                            setImage = function() {
                                var $this = $(this);

                                if ($this.is('img'))
                                    $this.attr('src', src);
                                else if (! $this.is('img'))
                                    $this.css('background-image',
                                              'url(' + src + ')');
                            };

                            $.each($images, setImage);
                        };

                        ajaxOptions = {
                            type: 'POST',
                            url: options.path,
                            data: formData,
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: changeImages
                        };

                        $.ajax(ajaxOptions);
                        $input.off('change.image-upload');
                    };

                $input.on('change.image-upload', submitChange);
                $input.trigger('click.image-upload');
            };

        $this.on('click.image-upload', triggerUpload);
    };

    $.each($uploaders, upload);
}());