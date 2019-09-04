(function (module) {

    module.controller('TabsBasicDemo', function () {
        var demo = this;

        demo.tabs = [
            { key: 'monitor', href: '#/dashboard' },
            { key: 'people', href: '#/people', active: true },
            { key: 'security', href: '#/security' },
            { key: 'setup', href: '#/setup' }
        ];

        demo.tabs2 = [
            {
                key: 'users',
                href: '#/people/users',
                active: true
            },
            { key: 'groups', href: '#/people/groups' },
            { key: 'directories', href: '#/directories' }
        ];

        demo.tabs3 = [
            { key: 'Profile', href: '#/people/users/profile', active: true },
            { key: 'Groups', href: '#/people/users/groups'},
            { key: 'Apps', href: '#people/users/apps'}
        ];
    });

})( angular.module('com.vmware.workspace.components.examples') );
