

/***********************************************
 Begin transition.js
 ***********************************************/

/* ===================================================
 * bootstrap-transition.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $(function () {

        $.support.transition = (function () {

            var transitionEnd = (function () {

                var el = document.createElement('bootstrap')
                    , transEndEventNames = {
                    'WebkitTransition' : 'webkitTransitionEnd'
                    ,  'MozTransition'    : 'transitionend'
                    ,  'OTransition'      : 'oTransitionEnd otransitionend'
                    ,  'transition'       : 'transitionend'
                }
                    , name

                for (name in transEndEventNames){
                    if (el.style[name] !== undefined) {
                        return transEndEventNames[name]
                    }
                }

            }())

            return transitionEnd && {
                end: transitionEnd
            }

        })()

    })

}(window.jQuery);

/***********************************************
 Begin hideremove.js
 ***********************************************/

!function ($) {

    // plugin dÃ©finition
    $.fn.hideRemove = function (speed) {
        return this.each(function () {
            var $this = $(this);

            function removeElement() { $this.remove() }

            $this.fadeTo(speed, 0, function(){
                $this.trigger($.Event('hideremove.done'))
                removeElement();
            });
        })
    }
}(window.jQuery);


/***********************************************
 Begin fader.js
 ***********************************************/

!function ($) {

    // Instanciation
    var Fader = function (el) {
        this.element = $(el);
        this.timing = parseInt(this.element.attr('data-fader')) ||Â 1000;
        this.initialize();
    }

    Fader.prototype.initialize = function(el) {

        // Masque l'Ã©lÃ©ment si celui-ci est visible
        if (this.element.is(':visible')) this.element.css('display', 'none');

        var $this = this;

        // On attend la fin de chargement de la fenÃªtre, puis on
        // active le fondu de l'image de cÃ´tÃ©
        $(window).load(function(){
            $this.element.fadeTo($this.timing, 1, function(){
                $this.element.trigger($.Event('fade.complete'));
            })
        })
    }

    // plugin dÃ©finition
    $.fn.fader = function (option) {
        return this.each(function () {  new Fader(this) })
    }

    $.fn.fader.Constructor = Fader

}(window.jQuery);

$(function(){ $('[data-fader]').fader() })


/***********************************************
 Begin splash.js
 ***********************************************/

/*
 * div + image prenant toute la taille du contenu et disparait
 * progressivement une fois la fenÃªtre chargÃ©e
 */

!function ($) {

    $.fn.splash = function (option) {

        return this.each(function () {
            var $this = $(this), wait = 2000, fade = 1000;

            setTimeout(function(){
                $this.hideRemove(fade);
                $this.trigger($.Event('splash.ended'));
            }, wait);
        })
    }

}(window.jQuery);

$(window).load(function(){ $('.splash').splash() })


/***********************************************
 Begin verticalize.js
 ***********************************************/

/*
 * Centrage vertical d'un element
 */

!function ($) {

    $.fn.verticalize = function () {

        var topHeight = $('header').height();
        var bottomHeight = $('footer').height();

        function verticalize(el) {
            var distance = (($(window).height() - el.height()) / 2);
            distance > topHeight && el.css('margin-top', distance);
        }

        return this.each(function () {

            var $this = $(this);

            //if ($this.height() < ($(window).height() - topHeight)) {

            $(window).resize(function(){ verticalize($this) });

            verticalize($this);
            //}
        })
    }

}(window.jQuery);

$(function(){ $('#salon article, .diaporama, .verticalize').verticalize() })
$(window).load(function(){ $('[data-verticalize]').verticalize() })


/***********************************************
 Begin trombinoscope.js
 ***********************************************/

$(function(){

    $('body').on('click', '#trombi a', function(e) {

        if ($(this).is('.active')) return false;

        var target = $(this).attr('href')

        // Suppression des anciens elements actifs
        $('#trombi').find('.active').removeClass('active');

        $(target).add(this).addClass('active');

    })

})


/***********************************************
 Begin sprite.js
 ***********************************************/

/*
 * Centrage vertical d'un element
 */

!function ($) {

    $.fn.animSprite = function () {

        var $this = this,
            // timer pour l'animation interne
            frameInterval,
            // timeout dÃ©finissant les pauses entre les animations
            globalTimeOut,
            // propriÃ©tÃ©s de l'Ã©lÃ©ment Ã  animer
            item	= {
                step		: $($this).height(),
                frames	: parseInt($($this).attr('data-frames')),
                loop		: parseInt($($this).attr('data-loop')),
                timing	: $.parseJSON($($this).attr('data-timing')),
                pos			: 0,
                dir			: true
            };

        // DurÃ©e de l'animation, en prenant en compte le cycle de l'animation
        item.duration = Math.ceil(parseInt($($this).attr('data-duration')) / (item.frames * (item.loop ||Â 1)));
        item.height		= item.step * item.frames;

        // Interval alÃ©atoire pour les pause entre les animations bouclÃ©es
        // Le range est dÃ©fini dans les paramÃ¨tres de configuration
        this.randomize = function() {
            return Math.random() * (item.timing[1] - item.timing[0]) + item.timing[0];
        }

        // Cycle d'animation des frames. 2 types possible: aller-retour ou aller simple.
        // A la fin de l'animation, on stoppe l'interval et relance le
        // timer global en case d'animation en boucle.
        this.animateFrame = function() {

            switch (item.loop)
            {
                case 0:
                    $this.loopFoward()
                    break;

                case 1:
                    $this.loopFoward()
                    break;

                case 2:
                    $this.loopFowardRewind()
                    break;
            }

            // DÃ©placement du sprite
            $this.css('background-position', '0 ' + '-'+(item.pos + 'px'))

            if (item.pos === 0) {

                // arrÃªte l'interval en fin d'animation.
                clearInterval(frameInterval)

                // Relance le timer en cas e boucle
                if (item.loop) globalTimeOut = $this.loopTimer($this.randomize())
            }
        }

        // DÃ©fini la position du sprite dans le cas d'une animation aller simple
        this.loopFoward = function(keepos){

            // La boucle est terminÃ©e en un allÃ© simple
            if (item.loop === 0 && (item.pos + item.step === item.height)) return clearInterval(frameInterval);

            item.pos = (item.pos === item.height) ? 0 : item.pos + item.step;
        }

        // DÃ©fini la position du sprite dans le cas d'une aniamtion aller-retour
        this.loopFowardRewind = function(){
            switch (item.pos)
            {
                case item.height:
                    item.dir = true;
                    break;

                case 0:
                    item.dir = false;
                    break;
            }
            item.pos = (item.dir) ? item.pos - item.step : item.pos + item.step;
        }

        // Interval Pour l'animation.
        // Celui-ci s'autodÃ©truit lorsqu'il revient Ã  son point de dÃ©part
        this.loopTimer = function(tOut) {
            globalTimeOut = setTimeout($this.animationTimer, tOut)
        }
        // interval de l'animation de la frame
        this.animationTimer = function() {
            frameInterval = setInterval($this.animateFrame, item.duration);
        }

        // Initialisation de l'animation
        this.loopTimer(this.randomize())
    }

}(window.jQuery);

$(window).load(function(){ $('.sprite').length && $('.sprite').animSprite() })


/***********************************************
 Begin textdraw.js
 ***********************************************/

/*
 * Le texte contenu dans l'Ã©lÃ©ment est retirÃ©, puis les lettres sont affichÃ©es
 * une par une jusqu'Ã  apparition complete
 */
!function ($) {

    // Instanciation
    var TextDraw = function (el) {
        this.element = $(el);
        this.initialize();
    }

    TextDraw.prototype.initialize = function() {

        // durÃ©e de l'animation
        this.duration = parseInt(this.element.attr('data-text-draw')) ||Â 5000;

        // Construit un tableau Ã  partir du texte
        this.text = this.element.text().split('');

        // supprime le text courant
        this.element.text('');

        // supprime la class css hide si trouvÃ©e
        this.element.hasClass('hide') && this.element.removeClass('hide');

        var $this = this,
            // pointeur interne
            index = 0,
            // durÃ©e d'apparition
            timing = Math.floor(this.duration / this.text.length);

        // apparition des lettres unes par unes
        var timer = setInterval(function(){

            // construction de l'Ã©lÃ©mement
            var letter = $('<span style="display:none">'+$this.text[index]+'</span>');

            // Fait apparaÃ®tre la lettre
            letter.appendTo($this.element).fadeTo(200, 1);

            // incrementation de l'index
            ++index == $this.text.length && clearInterval(timer)

        }, timing)

    }

    // plugin dÃ©finition
    $.fn.textdraw = function (option) {
        return this.each(function () {  new TextDraw(this) })
    }

    $.fn.textdraw.Constructor = TextDraw

}(window.jQuery);

$(function(){
    if ($('.splash').length) {
        $('body').on('splash.ended', '.splash', function(){
            $('[data-textdraw]').length && $('[data-textdraw]').textdraw()
        });
    }
    else {
        $('[data-textdraw]').length && $('[data-textdraw]').textdraw()
    }

})


/***********************************************
 Begin diapoduree.js
 ***********************************************/

!function ($) {

    // Instanciation
    var Diaporama = function (el) {
        this.element		= $(el);
        this.navigation = this.element.closest('nav').children('a');
        this.items			= this.element.children('li');

        this.initialize();
    }

    Diaporama.prototype = {

        initialize: function(){

            // capture la largeur du premier Ã©lÃ©ment et attribut la largeur Ã  la liste
            this.itemWidth = this.items.first().outerWidth();

            // Largeur de la list
            this.totalWidth = this.itemWidth * this.items.length;

            // Largeur du container
            this.containerWidth = this.element.closest('nav').width();

            // force la largeur en px
            this.element.children('li').width(this.itemWidth);

            // Attribue la largeur correcte Ã Â la liste
            this.element.width(this.totalWidth);

            // nombre de tranches
            this.sliceNumber = Math.ceil(this.totalWidth / this.containerWidth);

            // index actuel
            this.currentIndex = 0;

            this.bind()
        },

        // Associe les actions
        bind: function(){

            var $this = this;

            // Navigation precedent / suivant
            this.navigation.click(function(e){

                e.preventDefault();

                if ($(this).hasClass('prev')) {
                    $this.currentIndex = $this.currentIndex > 0 ? $this.currentIndex - 1 : $this.sliceNumber - 1;
                }
                else if ($(this).hasClass('next')) {
                    $this.currentIndex = $this.currentIndex + 1 < $this.sliceNumber ? $this.currentIndex + 1 : 0;
                }

                $this.move();
            });

            // affiche les dÃ©tails d'un Ã©lÃ©ment
            this.items.click(function(){

                // RÃ©fÃ©rence
                var target = $(this).attr('data-target');

                $('#'+target).add($(this)).addClass('active').siblings().removeClass('active')

            });

            this.items.first().trigger('click')

        },

        // dÃ©placement de la liste
        move: function() {

            // calcule la distance du margin
            var newPos = '-' + (this.containerWidth * this.currentIndex) + 'px';

            // dÃ©place la liste
            this.element.stop().animate({'margin-left': newPos})
        },

        // affiche l'Item correspondante dans la partie de gauche
        display: function() {

        }

    }

    // plugin dÃ©finition
    $.fn.diaporama = function (option) {
        return this.each(function () {  new Diaporama(this) })
    }

    $.fn.diaporama.Constructor = Diaporama

}(window.jQuery);

$(window).load(function(){ $('.diaporama .thumbnails ul').diaporama(); });