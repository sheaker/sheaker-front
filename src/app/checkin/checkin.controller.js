(function() {
    'use strict';

angular.module('sheaker')
.controller('CheckinCtrl', function ($rootScope, $scope, $location, $timeout, User, Payment, STATIC_URL) {

    var today = moment();

    $scope.checkin = function (userId) {
        User.get({user_id: userId}, function(user) {
            user.photo = STATIC_URL + '/sheaker-front/assets/images/user_unknow.png';
            if (user.photo) {
                user.photo = STATIC_URL + '/sheaker-back/' + user.photo;
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

            $timeout(function() {
                $scope.checkedUser = null;
                $scope.checkedUserId = null;
            }, 5000);
        }, function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', msg: 'This user doesn\'t exist.', exp: 5000});
        });

    };
});

})();
