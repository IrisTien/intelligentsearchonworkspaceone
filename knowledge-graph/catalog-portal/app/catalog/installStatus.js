(function(module) {
    'use strict';

    module.constant('INSTALL_STATUS', {
        //Install status enum
        //name: backend enumeration, value: i10n key
        ACTIVATED : { name: 'ACTIVATED', value: 'installStatus.activated',
            action: 'appCenter.action.added', nativeAction: 'appCenter.action.installed' },
        NOT_ACTIVATED : { name: 'NOT_ACTIVATED', value: 'installStatus.notActivated',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.install' },
        REQUEST : { name: 'REQUEST', value: 'installStatus.request',
            action: 'appCenter.action.request', nativeAction: 'appCenter.action.request' },
        ACTIVATION_IN_PROGRESS : { name: 'ACTIVATION_IN_PROGRESS', value: 'installStatus.processing' },
        ACTIVATION_REQUESTED : { name: 'ACTIVATION_REQUESTED', value: 'installStatus.processing'},
        ACTIVATION_FAILED : { name: 'ACTIVATION_FAILED', value: 'installStatus.notActivated',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.install' },
        DEACTIVATION_REQUESTED : { name: 'DEACTIVATION_REQUESTED', value: 'installStatus.processing'},
        DEACTIVATION_IN_PROGRESS : { name: 'DEACTIVATION_IN_PROGRESS', value: 'installStatus.processing'},
        DEACTIVATION_FAILED : { name: 'DEACTIVATION_FAILED', value: 'installStatus.processing'},
        DEACTIVATED : { name: 'DEACTIVATED', value: 'installStatus.processing'},
        REINSTALL : { name: 'REINSTALL', value: 'installStatus.reinstall'},

        HIDDEN : { name: 'HIDDEN', value: 'installStatus.hidden',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.add' },
        UPDATE : { name: 'UPDATE', value: 'installStatus.update',
            action: 'appCenter.action.add', nativeAction: 'appCenter.action.update' },
        PROCESSING : { name: 'PROCESSING', value: 'installStatus.processing' },
        REDIRECT : { name: 'REDIRECT_FOR_ACTIVATE', value: 'installStatus.processing'},
        FAILED_COMPLIANCE_CHECK : { name: 'FAILED_COMPLIANCE_CHECK', value: 'installStatus.failedComplianceCheck'},
        ADAPTER_INSTALL_FAILED : { name: 'ADAPTER_INSTALL_FAILED', value: 'installStatus.installFailedMessage'},
        ACCEPT_EULA : { name: 'ACCEPT_EULA', value: 'termsOfUse'},
        EULA_ACCEPTED : { name: 'EULA_ACCEPTED'},
        REDIRECT_FOR_ENROLL : { name: 'REDIRECT_FOR_ENROLL', value: 'installStatus.notActivated'},
        VPP_ACCEPT : { name: 'VPP_ACCEPT', value: 'appCenter.vppInviteTitle'}
    });

})(angular.module('com.vmware.greenbox.appCenter'));
