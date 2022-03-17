var game = {
    colorblind: (localStorage.colorblind && JSON.parse(localStorage.colorblind)) || 'false',
    language: window.location.hash.substring(1) || 'en',
    level: parseInt(localStorage.level, 10) || 0,
    answers: (localStorage.answers && JSON.parse(localStorage.answers)) || {},
    solved: (localStorage.solved && JSON.parse(localStorage.solved)) || [],
    user: localStorage.user || '',
    changed: false,
  
    start: function() {
      // navigator.language can iclude '-'
      // ref: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
      var requestLang = window.navigator.language.split('-')[0];
      if (window.location.hash === '' && requestLang !== 'en' && messages.languageActive.hasOwnProperty(requestLang)) {
        game.language = requestLang;
        window.location.hash = requestLang;
      }
  
      game.translate();
      $('#level-counter .total').text(levels.length);
      $('#editor').show();
      $('#share').hide();
      $('input[value="' + game.colorblind + '"]', '#colorblind').prop('checked', true);
  
      if (!localStorage.user) {
        game.user = '' + (new Date()).getTime() + Math.random().toString(36).slice(1);
        localStorage.setItem('user', game.user);
      }
  
      this.setHandlers();
      this.loadMenu();
      game.loadLevel(levels[game.level]);
    },
  
    setHandlers: function() {
      $('#next').on('click', function() {
        $('#code').focus();

  
        setTimeout(function() {
          if (game.level >= levels.length - 1) {
            game.win();
          } else {
            game.next();
          }
        }, 2000);
      });
  
      $('#code').on('keydown', function(e) {
        if (e.keyCode === 13) {
  
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            game.check();
            $('#next').click();
            return;
          }
  
          var max = $(this).data('lines');
          var code = $(this).val();
          var trim = code.trim();
          var codeLength = code.split('\n').length;
          var trimLength = trim.split('\n').length;
  
          if (codeLength >= max) {
  
            if (codeLength === trimLength) {
              e.preventDefault();
              $('#next').click();
            } else {
              $('#code').focus().val('').val(trim);
            }
          }
        }
      }).on('input', game.debounce(game.check, 500))
      
      $('#labelReset').on('click', function() {
        var warningReset = messages.warningReset[game.language] || messages.warningReset.en;
        var r = confirm(warningReset);
  
        if (r) {
          game.level = 0;
          game.answers = {};
          game.solved = [];
          game.loadLevel(levels[0]);
  
          $('.level-marker').removeClass('solved');
        }
      });
  
      $('#labelSettings').on('click', function() {
        $('#levelsWrapper').hide();
        $('#settings .tooltip').toggle();
      })
  
      $('#language').on('change', function() {
        window.location.hash = $(this).val();
      });
  
      $('#difficulty').on('change', function() {
        game.difficulty = $('input:checked', '#difficulty').val();
  
        // setting height will prevent a slight jump when the animation starts
        var $instructions = $('#instructions');
        var height = $instructions.height();
        $instructions.css('height', height);
  
        var $markers = $('.level-marker');
        
      });
  
  
      $('body').on('click', function() {
        $('.tooltip').hide();
      });
  
      $('.tooltip, .toggle, #level-indicator').on('click', function(e) {
        e.stopPropagation();
      });
  
      $(window).on('beforeunload', function() {
        game.saveAnswer();
        localStorage.setItem('level', game.level);
        localStorage.setItem('answers', JSON.stringify(game.answers));
        localStorage.setItem('solved', JSON.stringify(game.solved));
        localStorage.setItem('colorblind', JSON.stringify(game.colorblind));
      }).on('hashchange', function() {
        game.language = window.location.hash.substring(1) || 'en';
        game.translate();
  
  
        if (game.language === 'en') {
          history.replaceState({}, document.title, './');
        }
      });
    },
  
    prev: function() {
      this.level--;
  
      var levelData = levels[this.level];
      this.loadLevel(levelData);
    },
  
    next: function() {
      if (this.difficulty === "hard") {
        this.level = Math.floor(Math.random()* levels.length)
      } else {
        this.level++
      }
  
      var levelData = levels[this.level];
      this.loadLevel(levelData);
    },
  
    loadMenu: function() {
      levels.forEach(function(level, i) {
        var levelMarker = $('<span/>').addClass('level-marker').attr({'data-level': i, 'title': level.name}).text(i+1);
  
        if ($.inArray(level.name, game.solved) !== -1) {
          levelMarker.addClass('solved');
        }
  
        levelMarker.appendTo('#levels');
      });
  
      $('.level-marker').on('click', function() {
        game.saveAnswer();
  
        var level = $(this).attr('data-level');
        game.level = parseInt(level, 10);
        game.loadLevel(levels[level]);
      });
  
      $('#level-indicator').on('click', function() {
        $('#settings .tooltip').hide();
        $('#levelsWrapper').toggle();
      });
  
      $('.arrow.left').on('click', function() {
        if ($(this).hasClass('disabled')) {
          return;
        }
  
        game.saveAnswer();
        game.prev();
      });
  
      $('.arrow.right').on('click', function() {
        if ($(this).hasClass('disabled')) {
          return;
        }
  
        game.saveAnswer();
        game.next();
      });
    },
  
    loadLevel: function(level) {
      $('#editor').show();
      $('#share').hide();
      $('#background, #scene').removeClass('wrap').attr('style', '').empty();
      $('#levelsWrapper').hide();
      $('.level-marker').removeClass('current').eq(this.level).addClass('current');
      $('#level-counter .current').text(this.level + 1);
      $('#before').text(level.before);
      $('#after').text(level.after);
      $('#next').addClass('disabled');
  
      var instructions = level.instructions[game.language] || level.instructions.en;
      $('#instructions').html(instructions);
  
      $('.arrow.disabled').removeClass('disabled');
  
      if (this.level === 0) {
        $('.arrow.left').addClass('disabled');
      }
  
      if (this.level === levels.length - 1) {
        $('.arrow.right').addClass('disabled');
      }
  
      var answer = game.answers[level.name];
      $('#code').val(answer).focus();
  
      this.loadDocs();
  
      var lines = Object.keys(level.style).length;
      $('#code').height(20 * lines).data("lines", lines);
  
      var string = level.board;
      var markup = '';
      var colors = {
        'g': 'green',
        'r': 'red',
        'y': 'yellow'
      };
  
      for (var i = 0; i < string.length; i++) {
        var c = string.charAt(i);
        var color = colors[c];
  
        var bowl = $('<div/>').addClass('bowl ' + color + (this.colorblind == 'true' ? ' cb-friendly' : '')).data('color', color);
        var bean = $('<div/>').addClass('bean ' + color + (this.colorblind == 'true' ? ' cb-friendly' : '')).data('color', color);
  
        $('<div/>').addClass('bg').css(game.transform()).appendTo(bowl);
        $('<div/>').addClass('bg').appendTo(bean);
  
        $('#background').append(bowl);
        $('#scene').append(bean);
      }
  
      var classes = level.classes;
  
      if (classes) {
        for (var rule in classes) {
          $(rule).addClass(classes[rule]);
        }
      }
  
      var selector = level.selector || '';
      $('#background ' + selector).css(level.style);
  
      game.changed = false;
      game.applyStyles();
      game.check();
    },
  
    loadDocs: function() {
      $('#instructions code').each(function() {
        var code = $(this);
        var text = code.text();
  
        if (text in docs) {
          code.addClass('help');
          code.on('mouseenter', function(e) {
            if ($('#instructions .tooltip').length === 0) {
              var html = docs[text][game.language] || docs[text].en;
              var tooltipX = code.offset().left;
              var tooltipY = code.offset().top + code.height() + 13;
              $('<div class="tooltip"></div>').html(html).css({top: tooltipY, left: tooltipX}).appendTo($('#instructions'));
            }
          }).on('mouseleave', function() {
            $('#instructions .tooltip').remove();
          });
        }
      });
    },
  
    applyStyles: function() {
      var level = levels[game.level];
      var code = $('#code').val();
      var selector = level.selector || '';
      $('#scene' +  selector).attr('style', code);
      game.saveAnswer();
    },
  
    check: function() {
      game.applyStyles();
  
      var level = levels[game.level];
      var bowls = {};
      var beans = {};
      var correct = true;
  
      $('.bean').each(function() {
        var position = $(this).position();
        position.top = Math.floor(position.top);
        position.left = Math.floor(position.left);
  
        var key = JSON.stringify(position);
        var val = $(this).data('color');
        beans[key] = val;
      });
  
      $('.bowl').each(function() {
        var position = $(this).position();
        position.top = Math.floor(position.top);
        position.left = Math.floor(position.left);
  
        var key = JSON.stringify(position);
        var val = $(this).data('color');
  
        if (!(key in beans) || beans[key] !== val) {
          correct = false;
        }
      });
  
      if (correct) {
        ga('send', {
          hitType: 'event',
          eventCategory: level.name,
          eventAction: 'correct',
          eventLabel: $('#code').val()
        });
  
        if ($.inArray(level.name, game.solved) === -1) {
          game.solved.push(level.name);
        }
  
        $('[data-level=' + game.level + ']').addClass('solved');
        $('#next').removeClass('disabled');
      } else {
        ga('send', {
          hitType: 'event',
          eventCategory: level.name,
          eventAction: 'incorrect',
          eventLabel: $('#code').val()
        });
      }
    },
  
    saveAnswer: function() {
      var level = levels[this.level];
      game.answers[level.name] = $('#code').val();
    },
  
    win: function() {
      window.location.href="/win.html";
    },
  
    transform: function() {
      var scale = (0.972291);
      var rotate = (360);
  
      return {'transform': 'scale(' + scale + ') rotate(' + rotate + 'deg)'};
    },
  
    translate: function() {
      document.title = messages.title[game.language] || messages.title.en;
      $('html').attr('lang', game.language);
  
      var level = $('#editor').is(':visible') ? levels[game.level] : levelWin;
      var instructions = level.instructions[game.language] || level.instructions.en;
      $('#instructions').html(instructions);
      game.loadDocs();
  
      $('.translate').each(function() {
        var label = $(this).attr('id');
        if (messages[label]) {
          var text = messages[label][game.language] || messages[label].en;
        }
  
        $('#' + label).text(text);
      });
    },
  
    debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  };
    game.start();
  
  