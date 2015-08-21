(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('CheckinCtrl', CheckinCtrl);

    function CheckinCtrl($rootScope, $scope, $location, $timeout, User, Payment, STATIC_URL) {
        var today = moment(),
            timeoutPromise = null;

        $scope.checkin = function (userId) {
            if (timeoutPromise) {
                $timeout.cancel(timeoutPromise);
                $scope.checkedUser = null;
            }

            User.get({user_id: userId}, function(user) {
                if (user.photo) {
                    user.photo = STATIC_URL + '/sheaker-back/' + user.photo;
                }
                else {
                    user.photo = STATIC_URL + '/sheaker-front/assets/images/user_unknow.png';
                }

                user.isBirthday = moment(user.birthdate).month() === today.month() && moment(user.birthdate).date() === today.date();

                user.remainingDays = 0;
                if (user.active_membership_id) {
                    Payment.get({payment_id: user.active_membership_id}).$promise
                    .then(function(payment) {
                        user.remainingDays = moment.duration(moment(payment.end_date).diff(today)).asDays().toFixed();
                    })
                    .catch(function(error) {
                        console.log(error);
                        $rootScope.alerts.push({type: 'danger', msg: 'An error happen while retrieving payment.', exp: 5000});
                    });

                    User.saveCheckin({user_id: user.id}).$promise
                    .catch(function(error) {
                        console.log(error);
                        $rootScope.alerts.push({type: 'danger', msg: 'An error happen while checked in the user.', exp: 5000});
                    });
                }

                $scope.checkedUser = user;

                timeoutPromise = $timeout(function() {
                    $scope.checkedUser = null;
                    $scope.checkedUserId = null;
                }, 7000);
            }, function(error) {
                console.log(error);
                $rootScope.alerts.push({type: 'danger', msg: 'This user doesn\'t exist.', exp: 5000});
            });

        };
    }

})();
