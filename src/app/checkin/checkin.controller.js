(function() {
    'use strict';

    angular
        .module('sheaker')
        .controller('CheckinCtrl', CheckinCtrl);

    /** @ngInject */
    function CheckinCtrl($rootScope, $scope, $location, $timeout, $log, User, Payment, STATIC_URL) {
        var today = moment(),
            timeoutPromise = null;

        $scope.checkin = function (userId) {
            if (timeoutPromise) {
                $timeout.cancel(timeoutPromise);
                $scope.checkedUser = null;
            }

            User.get({user_id: userId}).$promise
                .then(function(user) {
                    if (!user.photo) {
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
                                $log.error(error);
                                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                            });

                        User.saveCheckin({user_id: user.id}).$promise
                            .catch(function(error) {
                                $log.error(error);
                                $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                            });
                    }

                    $scope.checkedUser = user;

                    timeoutPromise = $timeout(function() {
                        $scope.checkedUser = null;
                        $scope.checkedUserId = null;
                    }, 7000);
                })
                .catch(function(error) {
                    switch (error.status) {
                        case 404:
                            $rootScope.alertsMsg.error('User does not exist (#' + error.data.errors[0].code + ')');
                            break;
                        default:
                            $log.error(error);
                            $rootScope.alertsMsg.error('Oops... Something went wrong (#' + error.data.errors[0].code + ')');
                    }
                });

        };
    }

})();
