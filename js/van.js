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
      document.querySelector('#level-counter .total').text(levels.length);
      document.querySelector('#editor').show();
      document.querySelector('#share').hide();
      document.querySelector('input[value="' + game.colorblind + '"]', '#colorblind').prop('checked', true);
  
      if (!localStorage.user) {
        game.user = '' + (new Date()).getTime() + Math.random().toString(36).slice(1);
        localStorage.setItem('user', game.user);
      }
  
      this.setHandlers();
      this.loadMenu();
      game.loadLevel(levels[game.level]);
    },
  
    setHandlers: function() {
      document.querySelector('#next').addEventListener('click', function() {
        document.querySelector('#code').focus();

  
        setTimeout(function() {
          if (game.level >= levels.length - 1) {
            game.win();
          } else {
            game.nextElementSibling;
          }
        }, 2000);
      });
  
      document.querySelector('#code').addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
  
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            game.check();
            document.querySelector('#next').click();
            return;
          }
  
          var max = document.querySelector(this).data('lines');
          var code = document.querySelector(this).value;
          var trim = code.trim();
          var codeLength = code.split('n').length;
          var trimLength = trim.split('n').length;
  
          if (codeLength >= max) {
  
            if (codeLength === trimLength) {
              e.preventDefault();
              document.querySelector('#next').click();
            } else {
              document.querySelector('#code').focus().val('').val(trim);
            }
          }
        }
      }).addEventListener('input', game.debounce(game.check, 500))
      
      document.querySelector('#labelReset').addEventListener('click', function() {
        var warningReset = messages.warningReset[game.language] || messages.warningReset.en;
        var r = confirm(warningReset);
  
        if (r) {
          game.level = 0;
          game.answers = {};
          game.solved = [];
          game.loadLevel(levels[0]);
  
          document.querySelector('.level-marker').removeClass('solved');
        }
      });
  
      document.querySelector('#labelSettings').addEventListener('click', function() {
        document.querySelector('#levelsWrapper').hide();
        document.querySelector('#settings .tooltip').toggle();
      })
  
      document.querySelector('#language').addEventListener('change', function() {
        window.location.hash = document.querySelector(this).value;
      });
  
      document.querySelector('#difficulty').addEventListener('change', function() {
        game.difficulty = document.querySelector('input:checked', '#difficulty').value;
  
        // setting height will prevent a slight jump when the animation starts
        var $instructions = document.querySelector('#instructions');
        var height = $instructions.height();
        $instructions.css('height', height);
  
        var $markers = document.querySelector('.level-marker');
        
      });
  
  
      document.querySelector('body').addEventListener('click', function() {
        document.querySelector('.tooltip').hide();
      });
  
      document.querySelector('.tooltip, .toggle, #level-indicator').addEventListener('click', function(e) {
        e.stopPropagation();
      });
  
      document.querySelector(window).addEventListener('beforeunload', function() {
        game.saveAnswer();
        localStorage.setItem('level', game.level);
        localStorage.setItem('answers', JSON.stringify(game.answers));
        localStorage.setItem('solved', JSON.stringify(game.solved));
        localStorage.setItem('colorblind', JSON.stringify(game.colorblind));
      }).addEventListener('hashchange', function() {
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
        var levelMarker = document.querySelector('<span/>').classList.add('level-marker').attr({'data-level': i, 'title': level.name}).text(i+1);
  
        if ($.inArray(level.name, game.solved) !== -1) {
          levelMarker.classList.add('solved');
        }
  
        levelMarker.appendTo('#levels');
      });
  
      document.querySelector('.level-marker').addEventListener('click', function() {
        game.saveAnswer();
  
        var level = document.querySelector(this).attr('data-level');
        game.level = parseInt(level, 10);
        game.loadLevel(levels[level]);
      });
  
      document.querySelector('#level-indicator').addEventListener('click', function() {
        document.querySelector('#settings .tooltip').hide();
        document.querySelector('#levelsWrapper').toggle();
      });
  
      document.querySelector('.arrow.left').addEventListener('click', function() {
        if (document.querySelector(this).classList.contains('disabled')) {
          return;
        }
  
        game.saveAnswer();
        game.previousElementSibling;
      });
  
      document.querySelector('.arrow.right').addEventListener('click', function() {
        if (document.querySelector(this).classList.contains('disabled')) {
          return;
        }
  
        game.saveAnswer();
        game.nextElementSibling;
      });
    },
  
    loadLevel: function(level) {
      document.querySelector('#editor').show();
      document.querySelector('#share').hide();
      document.querySelector('#background, #scene').removeClass('wrap').attr('style', '').empty();
      document.querySelector('#levelsWrapper').hide();
      document.querySelector('.level-marker').removeClass('current').eq(this.level).classList.add('current');
      document.querySelector('#level-counter .current').text(this.level + 1);
      document.querySelector('#before').text(level.before);
      document.querySelector('#after').text(level.after);
      document.querySelector('#next').classList.add('disabled');
  
      var instructions = level.instructions[game.language] || level.instructions.en;
      document.querySelector('#instructions').html(instructions);
  
      document.querySelector('.arrow.disabled').removeClass('disabled');
  
      if (this.level === 0) {
        document.querySelector('.arrow.left').classList.add('disabled');
      }
  
      if (this.level === levels.length - 1) {
        document.querySelector('.arrow.right').classList.add('disabled');
      }
  
      var answer = game.answers[level.name];
      document.querySelector('#code').val(answer).focus();
  
      this.loadDocs();
  
      var lines = Object.keys(level.style).length;
      document.querySelector('#code').height(20 * lines).data("lines", lines);
  
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
  
        var bowl = document.querySelector('<div/>').classList.add('bowl ' + color + (this.colorblind == 'true' ? ' cb-friendly' : '')).data('color', color);
        var bean = document.querySelector('<div/>').classList.add('bean ' + color + (this.colorblind == 'true' ? ' cb-friendly' : '')).data('color', color);
  
        document.querySelector('<div/>').classList.add('bg').css(game.transform()).appendTo(bowl);
        document.querySelector('<div/>').classList.add('bg').appendTo(bean);
  
        document.querySelector('#background').insertAdjacentHTML("beforeend",bowl);
        document.querySelector('#scene').insertAdjacentHTML("beforeend",bean);
      }
  
      var classes = level.classes;
  
      if (classes) {
        for (var rule in classes) {
          document.querySelector(rule).classList.add(classes[rule]);
        }
      }
  
      var selector = level.selector || '';
      document.querySelector('#background ' + selector).css(level.style);
  
      game.changed = false;
      game.applyStyles();
      game.check();
    },
  
    loadDocs: function() {
      document.querySelector('#instructions code').each(function() {
        var code = document.querySelector(this);
        var text = code.text();
  
        if (text in docs) {
          code.classList.add('help');
          code.addEventListener('mouseenter', function(e) {
            if (document.querySelector('#instructions .tooltip').length === 0) {
              var html = docs[text][game.language] || docs[text].en;
              var tooltipX = code.offset().left;
              var tooltipY = code.offset().top + code.height() + 13;
              document.querySelector('<div class="tooltip"></div>').html(html).css({top: tooltipY, left: tooltipX}).appendTo(document.querySelector('#instructions'));
            }
          }).addEventListener('mouseleave', function() {
            document.querySelector('#instructions .tooltip').remove();
          });
        }
      });
    },
  
    applyStyles: function() {
      var level = levels[game.level];
      var code = document.querySelector('#code').value;
      var selector = level.selector || '';
      document.querySelector('#scene' +  selector).attr('style', code);
      game.saveAnswer();
    },
  
    check: function() {
      game.applyStyles();
  
      var level = levels[game.level];
      var bowls = {};
      var beans = {};
      var correct = true;
  
      document.querySelector('.bean').each(function() {
        var position = document.querySelector(this).position();
        position.top = Math.floor(position.top);
        position.left = Math.floor(position.left);
  
        var key = JSON.stringify(position);
        var val = document.querySelector(this).data('color');
        beans[key] = val;
      });
  
      document.querySelector('.bowl').each(function() {
        var position = document.querySelector(this).position();
        position.top = Math.floor(position.top);
        position.left = Math.floor(position.left);
  
        var key = JSON.stringify(position);
        var val = document.querySelector(this).data('color');
  
        if (!(key in beans) || beans[key] !== val) {
          correct = false;
        }
      });
  
      if (correct) {
        ga('send', {
          hitType: 'event',
          eventCategory: level.name,
          eventAction: 'correct',
          eventLabel: document.querySelector('#code').value
        });
  
        if ($.inArray(level.name, game.solved) === -1) {
          game.solved.push(level.name);
        }
  
        document.querySelector('[data-level=' + game.level + ']').classList.add('solved');
        document.querySelector('#next').removeClass('disabled');
      } else {
        ga('send', {
          hitType: 'event',
          eventCategory: level.name,
          eventAction: 'incorrect',
          eventLabel: document.querySelector('#code').value
        });
      }
    },
  
    saveAnswer: function() {
      var level = levels[this.level];
      game.answers[level.name] = document.querySelector('#code').value;
    },
  
    win: function() {
      var solution = document.querySelector('#code').value;
  
      this.loadLevel(levelWin);
  
      document.querySelector('#editor').hide();
      document.querySelector('#code').val(solution);
      document.querySelector('#share').show();
      document.querySelector('.bean .bg').removeClass('pulse').classList.add('bounce');
    },
  
    transform: function() {
      var scale = (0.972291);
      var rotate = (360);
  
      return {'transform': 'scale(' + scale + ') rotate(' + rotate + 'deg)'};
    },
  
    translate: function() {
      document.title = messages.title[game.language] || messages.title.en;
      document.querySelector('html').attr('lang', game.language);
  
      var level = document.querySelector('#editor').is(':visible') ? levels[game.level] : levelWin;
      var instructions = level.instructions[game.language] || level.instructions.en;
      document.querySelector('#instructions').html(instructions);
      game.loadDocs();
  
      document.querySelector('.translate').each(function() {
        var label = document.querySelector(this).attr('id');
        if (messages[label]) {
          var text = messages[label][game.language] || messages[label].en;
        }
  
        document.querySelector('#' + label).text(text);
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
  
  