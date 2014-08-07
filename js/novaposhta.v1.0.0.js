(function($){

    $.fn.novaposhta = function(lang, options){

        $.fn.novaposhta.options = $.extend({}, $.fn.novaposhta.options, options);
        var region = $(this).first();

        request({
            lang: lang,
            type: ''
        }, function(response){
            buildOptions(region, response);

            selectOption(region);
        });

        return this.each(function(){
            $(this).on('change', function(e){
                $(this).removeAttr('rel');

                if($(this).attr('name') == 'department')
                    return ;

                var params = {
                    lang: lang,
                    type: $(this).attr('name'),
                    id: $(this).val()
                };

                if(params.id > 0) {
                    request(params, function(response){
                        clearNext(params.type);

                        var obj = getObjByType(nextType(params.type));
                        if(obj !== null) {
                            buildOptions(obj, response);

                            selectOption(obj);
                        }
                    });
                }
                else
                {
                    clearNext(params.type);
                }

            });
        });
    };

    $.fn.novaposhta.options = {
        onStart: function() {},
        onComplete: function() {}
    };

    function selectOption(obj, id) {
        var id = $(obj).attr('rel');

        if(id > 0) {
            obj.find('option[value="'+ id +'"]').attr('selected', true);
            obj.change();
        }
    }

    function request(params, callback) {

        if(typeof $.fn.novaposhta.options.onStart == 'function')
            $.fn.novaposhta.options.onStart(params);

        $.getJSON(buildUrl(params))
         .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        })
        .done(function(response){
                if(typeof $.fn.novaposhta.options.onComplete == 'function')
                    $.fn.novaposhta.options.onComplete(response, params);

                callback(response, params);
            });
    };

    function buildUrl(params) {
        var url = 'http://np.artefact.in.ua/';

        url += params.lang + '/';

        var type = 'region';
        if(params.type)
            type = nextType(params.type);

        url += type + '/';

        if(params.id)
            url += params.id + '/';

        return url.replace(/\/$/i, '')+'?jsoncallback=?';
    };

    function buildOptions(obj, response) {
        clearSelect(obj);

        for(var i in response) {
            $(obj).append($('<option value="'+ response[i].id +'">'+ response[i].title +'</option>'))
        }
    };

    function nextType(type) {
        switch(type) {
            case 'region':  type = 'city'; break;
            case 'city':    type = 'department'; break;
            case 'department': type = null; break;
        }

        return type;
    }

    function clearNext(type) {
        type = nextType(type);
        var obj = getObjByType(type);

        if(obj == null) {
            return ;
        }

        clearSelect(obj);

        clearNext(type);
    }

    function clearSelect(obj) {
        obj.find('option').not('[value=""]').remove();
    }

    function getObjByType(type) {
        if(type !== null)
            return $('select[name="'+ type +'"');

        return null;
    }


}(jQuery));