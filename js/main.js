$(window).on('load', function() {
    portfolio.init();
    $('body').scroll(function() {
        portfolio.elementInView();
    })
});


let portfolio = {

    turkeyToSteak: true,
    person: null,
    Connor: './images/connor.PNG',
    Jordan: './images/jordan.PNG',
    Astrid: './images/astrid.PNG',

    init: function() {
        // Simon, Hoblik
        this.dynamicText('.dynamic-text-container h1', '.9', 'none');

        $('.person-container').click(this.userSelect);

        $('.date p').click(this.sendAvailability);

        this.getAllUserAvailability();
    },

    dynamicText: function(selector, opacity, transform) {
        let h1 = $(selector);
        let timeout = 0;

        for (let i = 0; i < h1.length; i++) {
            setTimeout(function() {
                $(h1[i]).css({
                    'opacity': opacity,
                    'transform': transform
                });
            }, timeout);
            timeout += 350;
        }
    },

    elementInView: function() {
        let scrollTop = $('body').scrollTop();

        if (this.turkeyToSteak && scrollTop >= $('#target').position().top) {
            this.turkeySteakTransition();
        } else if ($('#target2').position().top) {

        }
    },

    turkeySteakTransition: function() {
        this.turkeyToSteak = false;

        setTimeout(function() {
            $('#turkey').addClass('getTheFuckOut');
            $('#steak').removeClass('getTheFuckOut');
        }, 1500);

        setTimeout(function() {
            $('span.sizzle.second').css('display', 'block');
            setTimeout(function() {
                $('span.sizzle.second').css('display', 'none');
            }, 300)
        }, 2500)

        setTimeout(function() {
            $('span.sizzle.third').css('display', 'block');
            setTimeout(function() {
                $('span.sizzle.third').css('display', 'none');
            }, 300)
        }, 2800)

        setTimeout(function() {
            $('span.sizzle.first').css('display', 'block');
            setTimeout(function() {
                $('span.sizzle.first').css('display', 'none');
            }, 300)
        }, 3100)

        setTimeout(function() {
            $('.downArrow').css('opacity', '1');
        }, 3300);

        setTimeout(function() {
            $('.section-container.hidden').css('display', 'block');
        }, 3300);
    },
    getAllUserAvailability: function() {
        $.ajax({
            url: '../friendsgiving/server/actions/getAllUserAvailability.php',
            dataType: 'JSON',
            type: 'GET',
            success: function(response) {
                if (response.result && response.result.length) {
                    portfolio.addUserIcons(response.result);
                }
            },
            error: function(response) {
                console.log(response);
            }
        })
    },

    addUserIcons: function(users) {
        for (let i = 0; i < users.length; i++) {
            let img = $('<img>').attr({
                'src': portfolio[users[i][1]],
                'id': users[i][1] + users[i][2]
            });

            $('#userTarget' + users[i][2]).append(img);
        }
    },

    userSelect: function(e) {
        let target = $(e.target);
        $('.people-container img').css('border', 'none');
        target.css('border', '3px solid green');
        portfolio.person = $(target).attr('data');
        //reset
        $('#stickNameHere').text(portfolio.person);
        $('.date p').attr('shoulddelete', false).css('border-color', '#dd7703');

        $.ajax({
            url: '../friendsgiving/server/actions/getUserAvailability.php',
            dataType: 'JSON',
            type: 'POST',
            data: {
                name: portfolio.person,
            },
            success: function(response) {
                console.log(response);
                if (response.result && response.result.length) {
                    portfolio.updateDates(response.result);
                }
            },
            error: function(response) {
                console.log(response);
            }
        })
    },

    updateDates: function(dates) {
        for (let i = 0; i < dates.length; i++) {
            $('.date p[data='+ dates[i] +']').css('border-color', 'green');
            $('.date p[data='+ dates[i] +']').attr('shoulddelete', true);
            $('.date[data='+ dates[i] +']').attr('shoulddelete', true);
        }
    },

    sendAvailability: function(e) {
        let target = $(e.target);
        let date = $(target).attr('data');
        //reset
        $('#error').text('');
        if (target.attr('shoulddelete') && target.attr('shoulddelete') != "false") {
            $.ajax({
                url: '../friendsgiving/server/actions/removeDate.php',
                dataType: 'JSON',
                type: 'POST',
                data: {
                    name: portfolio.person,
                    date: date
                },
                success: function(response) {
                    console.log(response);
                    portfolio.dateRemoved(response.date);
                },
                error: function(response) {
                    console.log(response);
                }
            })
        } else {
            $.ajax({
                url: '../friendsgiving/server/actions/addDate.php',
                dataType: 'JSON',
                type: 'POST',
                data: {
                    name: portfolio.person,
                    date: date
                },
                success: function(response) {
                    console.log(response);
                    if (!response.errors.length) {
                        portfolio.dateSelected(response.date);
                    } else {
                        $('#error').text('Select a user first');
                    }
                },
                error: function(response) {
                    console.log(response);
                }
            })
        }
    },

    dateRemoved: function(date) {
        $('.date p[data='+ date +']').css('border-color', '#dd7703');
        $('.date p[data='+ date +']').attr('shoulddelete', false);
        $('.date[data='+ date +']').attr('shoulddelete', false);
        $('#' + portfolio.person + date).remove();
    },

    dateSelected: function(date) {
        $('.date p[data='+ date +']').css('border-color', 'green');
        $('.date p[data='+ date +']').attr('shoulddelete', true);
        $('.date[data='+ date +']').attr('shoulddelete', true);

        let img = $('<img>').attr({
            'src': portfolio[portfolio.person],
            'id': portfolio.person + date
        });

        $('#userTarget' + date).append(img);
    }
};