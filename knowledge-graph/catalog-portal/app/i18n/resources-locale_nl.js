// (c) 2014 VMware, Inc.  All rights reserved.
(function(module) {
    module.constant('l10n', {
        "service.under.maintenance.error":"Workspace ONE is tijdelijk in onderhoudsmodus. U kunt uw applicaties wel opstarten, maar sommige functies werken wellicht niet.",
        "appCenter.device.unEnrollWarningMessage":"Als u zich uitschrijft, zult u tot enkele applicaties niet langer toegang hebben. Wilt u verder gaan?",
        "appCenter.action.add":"Toevoegen+",
        "userInfo.unenroll":"Uitschrijven",
        "myapps.welcomeMsg": "Hallo, {0}. Hier zijn uw applicaties!",
        "api.updateApps": "De lijst wordt geüpdatet...",
        "installStatus.enrollDevice": "Om {0} te kunnen gebruiken moet Workspace Services geactiveerd worden, zodat bedrijfsgegevens beveiligd worden.",
        "installStatus.unenrolledDevice": "Deze applicatie is niet meer beschikbaar voor uw. Klik op OK om de lijst te updaten.",
        "changeOccurred": "Er is een wijzing opgetreden.",
        "appCenter.auth.mdmError": "Niet alle applicaties konden op dit moment worden geladen. Er is een configuratie- of netwerkfout tijdens de communicatie met het MDM-systeem.",
        "appCenter.device.status.commError": "Het MDM-systeem meldt een fout tijdens het ophalen van applicaties voor uw toestel.",
        "appCenter.device.status.deviceInputError": "Dit toestel is ongeldig. Neem contact op met uw systeembeheerder a.u.b.",
        "appCenter.device.mdmApps.notFoundError": "Het MDM-systeem kon geen applicaties vinden die aan uw toestel zijn toegewezen.",
        "appCenter.nav.browseBy": "Bladeren op",
        "app.launchPassword.heading": "Wachtwoordaanvraag",
        "app.launchPassword.view.instruction": "We hebben uw wachtwoord nodig om in deze Windows-resource {0} in te loggen.",
        "app.launchPassword.label.userName": "Gebruiker",
        "app.launchPassword.label.password": "wachtwoord",
        "app.launchPassword.button.label.signin": "Inloggen",
        "appCenter" : "Applicatiecentrum",
        "ok" : "Ok",
        "viewDownloadUrl":"http://www.vmware.com/go/viewclients",
        "viewDownloadUrlIOS":"itms-apps://itunes.apple.com/app/vmware-horizon-view-client/id417993697?mt=8",
        "viewDownloadUrlAndroid":"http://play.google.com/store/apps/details?id=com.vmware.view.client.android",
        "citrixReceiverDownloadUrl":"http://receiver.citrix.com",
        "workspaceDownloadUrl":"/download",
        "horizonDesktopNotDetected": "VMware Identity Manager Desktop moet op deze computer geïnstalleerd zijn om deze applicatie te openen. <a target='_blank' href='{0}'>Installeer VMware Identity Manager Desktop</a> als u dat nog niet gedaan heeft.",
        "viewAppsTooltip":"Deze View applicatie heeft {0} Horizon Client {1} 3.0 of recenter nodig om op uw computer geïnstalleerd te kunnen worden.",
        "desktoneDesktopTooltip":"Deze Horizon DaaS-desktop heeft {0} Horizon View {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "desktoneApplicationTooltip":"Deze Horizon DaaS-applicatie heeft {0} Horizon View {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "xenAppsReceiverNotDetected": "Citrix Receiver moet op deze computer geïnstalleerd zijn om deze applicatie te openen. <a target='_blank' href='{0}'>Installeer Citrix Receiver</a> als u dat nog niet gedaan heeft.",
        "button.save" : "Opslaan",
        "button.openHorizonView": "Horizon Client openen",
        "myapps.launch.openApp": "{0} openen",
        "button.openApp": "App openen",
        "button.clear": "Wissen",
        "button.close": "Sluiten",
        "myapps.launch.view.openWith": "Openen met",
        "myapps.launch.view.preferredClient.horizonView": "Horizon View",
        "myapps.launch.view.preferredClient.browser": "Browser",
        "myapps.launch.view.preferredClient.isDefault": "(standaard)",
        "myapps.launch.view.selectPreferredLaunchClient": "Selecteer hoe u Horizon desktops en applicaties wilt openen",
        "myapps.launch.view.selectPreferredLaunchClientMobile": "KIES EEN STANDAARDMETHODE...",
        "myapps.launch.view.mobileDefaultViewClientDesc": "Hiermee wordt bepaalt hoe een View desktop op uw toestel standaard geopend wordt. Als u View als uw standaard selecteert, moet u Horizon Client geïnstalleerd hebben. <a target='_blank' href='{0}'>Installeer Horizon Client</a> als u dat nog niet gedaan heeft.",
        "myapps.launch.view.unknownClientType": "Onbekend client-type om Horizon Client mee te openen.",
        "myapps.launch.view.openWithView" : "Openen met Horizon Client",
        "myapps.launch.view.openWithBrowser" : "Openen met Browser",
        "myapps.launch.view.preferredClient.byBrowser.description": "Als u Browser selecteert, zal uw View in een nieuw browservenster worden geopend.",
        "myapps.launch.view.preferredClient.byViewClient.description": "Voor dit item heeft u Horizon Client 3.0 of recenter nodig. <a target='_blank' href='{0}'>Installeer Horizon Client</a> als u dat nog niet gedaan heeft.",
        "myapps.launch.view.preferredClient.changeLaunchPrefTip": "U kunt deze instelling altijd wijzigen in het menu met voorkeursinstellingen.",
        "myapps.launch.msg.launching.desktop":"Desktop wordt geopend <b>{0}</b> .....",
        "myapps.launch.msg.launching.application":"Applicatie wordt geopend <b>{0}</b> .....",
        "myapps.noAppsMsg": "U heeft geen applicaties toegevoegd. U kunt naar de {0} gaan om applicaties toe te voegen.",
        "myapps.noFavAppsMsg": "U heeft nog geen applicaties in favorieten geplaatst.",
        "myapps.dialog.openApp": "OPENEN",
        "myapps.dialog.openAppWithViewClient": "In Client openen",
        "myapps.dialog.openAppWithBrowser": "In browser openen",
        "deviceStatus.networkLost" : "U heeft geen netwerkverbinding meer.",
        "deviceStatus.networkRestored" : "Netwerkverbinding hersteld",
        "api.session.expired.retry":"Sessie is verlopen. We proberen nu de sessie te vernieuwen...",
        "api.error":"Er is een fout opgetreden. Probeer het opnieuw.",
        "api.timeout":"Time-out in de verbinding. Probeer het opnieuw.",
        "favoriteStatus.favorite" : "In favorieten plaatsen",
        "favoriteStatus.unfavorite" : "Uit favorieten verwijderen",
        "favoriteStatus.offlineFavoriteMessage": "U kunt geen applicaties in favorieten plaatsen als u offline bent. Maak verbinding en probeer het opnieuw.",
        "error.failToFavoriteApp": "De status als favoriet of niet-favoriet kon niet worden geüpdatet.",
        "error.failToHideApp": "De applicatie kon niet worden verwijderd.",
        "error.failToShowApp": "De applicatie kon niet aan de Launcher worden toegevoegd.",
        "installStatus.offlineInstallMessage": "U kunt geen applicaties installeren als u offline bent. Maak verbinding en probeer het opnieuw.",
        "installStatus.activated": "Geactiveerd",
        "installStatus.notActivated": "Niet-geactiveerd",
        "installStatus.request": "Aanvragen",
        "installStatus.update": "Update",
        "installStatus.processing": "Bezig met verwerken",
        "installStatus.installFailedMessage": "Probeer het opnieuw. Als dit probleem blijft optreden, neem dan contact op met uw systeembeheerder.",
        "requestFailed": "Aanvraag mislukt",
        "requestSuccessful": "Aanvraag geslaagd",
        "accept": "Accepteren",
        "decline": "Weigeren",
        "termsOfUse": "Gebruikersovereenkomst",
        "beforeInstallation": "Voor installatie",
        "resetDesktopStatus.offlineMessage": "U kunt geen bureaublad opnieuw instellen als u offline bent. Maak verbinding en probeer het opnieuw.",
        "error.failToResetDesktop": "Desktop kon niet opnieuw worden ingesteld.",
        "resetDesktop.sucess": "Desktop opnieuw instellen geslaagd.",
        "appCenter.someAppsMissingMessage": "Niet alle applicaties konden nu worden geladen.",
        "appCenter.device.status.notRegistered": "Toestel is niet geregistreerd.",
        "appCenter.device.status.blackListed": "Dit toestel staat op de zwarte lijst.",
        "appCenter.device.status.unknownError": "Er is een onbekende fout opgetreden.",
        "appCenter.device.register": "Toestel registreren",
        "appCenter.device.moreDetails":"Meer details",
        "appCenter.noAppsMsg": "Er zijn momenteel geen applicaties beschikbaar.",
        "appCenter.noSearchResults": "Geen resultaten gevonden",
        "appCenter.vppInviteTitle": "Registratie - beheerde distributie",
        "appCenter.appInstallConfirmPromptTitle": "Bevestig installatie",
        "appCenter.acceptInvite": "Accepteer uitnodiging",
        "appCenter.install": "Installeren",
        "appCenter.proceed": "Verder",
        "appCenter.cancel": "Annuleren",
        "appCenter.searchApps": "Zoek applicaties",
        "appCenter.welcomeMsg": "Installeer nieuwe applicaties: waar dan ook en op elk toestel!",
        "appCenter.done": "Gereed",
        "appCenter.nav.privacyPage": "Pagina met privacybeleid",
        "appCenter.nav.catalog": "Catalogus",
        "appCenter.nav.myApps": "Mijn applicaties",
        "appCenter.nav.favorites": "Favorieten",
        "appCenter.nav.categories": "Categorieën",
        "appCenter.nav.filterby": "Filteren op",
        "appCenter.nav.show": "Weergeven",
        "appCenter.nav.settings": "Instellingen",
        "appCenter.nav.sortBy": "Sorteren op",
        "appCenter.nav.sortBy.alpha": "A-Z",
        "appCenter.nav.filter": "Filter",
        "appCenter.action.install": "Installeren",
        "appCenter.action.installed": "Geïnstalleerd",
        "appCenter.action.added": "Toegevoegd",
        "appCenter.action.processing": "Bezig met verwerken",
        "appCenter.action.update": "Update",
        "appCenter.action.request": "Aanvragen",
        "appCenter.type.web": "Webapplicatie",
        "appCenter.type.native": "Systeemeigen applicatie",
        "appCenter.type.native.platform": "{0}-applicatie",
        "appCenter.type.virtual": "Virtuele applicatie",
        "myapp.nav.categories": "Categorieën",
        "myapp.nav.favorites": "Favorieten",
        "myapp.nav.allApps": "Alle applicaties",
        "myapp.label.new": "Nieuw",
        "myapp.nav.filterby": "Filteren op",
        "userInfo.adminConsole":"Beheerdersconsole",
        "userInfo.preferences":"Voorkeuren",
        "userInfo.about":"Over",
        "userInfo.devices":"Toestellen",
        "userInfo.signout":"Uitloggen",
        "app.details.link.back": "Terug",
        "app.details.nav.details": "Gegevens",
        "app.details.nav.reviews": "Beoordelingen",
        "app.details.label.description": "Omschrijving",
        "app.details.label.seeFullDetails": "Volledige details weergeven...",
        "app.details.label.information": "Informatie",
        "app.details.label.category": "Categorieën",
        "app.details.label.version": "Versie:",
        "app.details.label.type": "Type:",
        "app.details.label.type.SAML11": "Webapplicatie",
        "app.details.label.type.SAML20": "Webapplicatie",
        "app.details.label.type.WEBAPPLINK": "Webapplicatie",
        "app.details.label.type.WSFED12": "Webapplicatie",
        "app.details.label.type.XENAPP": "Xen App",
        "app.details.label.type.XENAPPDELIVERYGROUP": "Citrix Desktop",
        "app.details.label.type.THINAPP": "ThinApp",
        "app.details.label.type.VIEWPOOL": "View desktop",
        "app.details.label.type.VIEWAPP": "View applicatie",
        "app.details.label.type.DESKTONEDESKTOP": "Desktone desktop",
        "app.details.label.type.DESKTONEAPPLICATION": "Desktone applicatie",
        "app.details.label.type.APPV": "AppV",
        "app.details.label.size": "Omvang",
        "app.details.label.price": "Prijs",
        "app.details.label.screenshots": "Schermafdrukken",
        "app.details.label.requirement": "Vereisten:",
        "app.details.label.packageName": "Pakketnaam:",
        "app.details.thinapp.requirement": "Deze applicatie werkt alleen op een Windows-computer met Identity Manager Desktop geïnstalleerd.",
        "app.details.viewDesktop.requirement": "Deze View desktop heeft {0} Horizon Client {1} 3.0 of recenter nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.viewapp.requirement": "Deze View applicatie heeft {0} Horizon Client {1} 3.0 of recenter nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.xenapp.requirement": "Deze applicatie heeft {0\} Citrix Receiver {1} nodig om geïnstalleerd te kunnen worden.",
        "app.details.xenapp.msg.IE8OrLower":"Voor deze applicatie moet Citrix Receiver geïnstalleerd zijn. N.B: Deze applicatie kan niet in Internet Explorer 8 worden geopend.",
        "app.details.xenappsDeliveryGroup.requirement":"Deze Citrix Desktop heeft {0\} Citrix Receiver {1} nodig om geïnstalleerd te kunnen worden.",
        "app.details.desktoneDesktop.requirement": "Deze Horizon DaaS Desktop heeft {0} Horizon Client {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.desktoneApp.requirement": "Deze Horizon DaaS-applicatie heeft {0} Horizon Client {1} nodig om op uw computer geïnstalleerd te kunnen worden.",
        "app.details.abbrev.megabytes": "MB",
        "app.details.noData": "Geen informatie beschikbaar",
        "app.details.noScreenshots": "Geen schermafdrukken beschikbaar",
        "app.details.noDescription": "Geen omschrijving beschikbaar",
        "app.details.needsDeviceEnrollment": "Toestel moet ingeschreven zijn",
        "app.settings.label.settings": "Instellingen",
        "app.settings.link.back": "Terug",
        "app.settings.managedDevices": "Beheerde toestellen",
        "app.nav.tab.launcher":"LAUNCHER",
        "app.nav.tab.catalog":"CATALOGUS",
        "app.about.heading":"About VMware Workspace",
        "app.about.copyright":"Copyright ©2013-2017 VMware, Inc. All rights reserved. This product is protected by copyright and intellectual property laws in the United States and other countries as well as by international treaties. VMware products are covered by one or more patents.",
        "app.about.button.label.privacyPolicy":"Privacybeleid",
        "app.about.button.label.patents":"Patent",
        "app.about.button.label.licenseAgreement":"Licentieovereenkomst",
        "app.about.privactPolicyLink":"http://www.vmware.com/help/horizon-workspace-privacy-supplement.html",
        "app.about.patentsLink":"http://www.vmware.com/go/patents-nl",
        "app.about.licenseAgreementLink":"http://www.vmware.com/nl/download/eula/universal_eula.html",
        "app.about.saasLicenseAgreementLink":"http://www.vmware.com/nl/download/eula/identity-manager-terms-of-service.html",
        "app.devices.heading":"Toestellen",
        "app.devices.tableColumn.deviceName":"Toestelnaam",
        "app.devices.tableColumn.userDeviceId":"Toestel-ID",
        "app.devices.tableColumn.lastLoginTime":"Laatste keer ingelogd",
        "app.devices.unlinkDevice":"Koppeling verwijderen",
        "app.devices.unlinkedDevice": "Koppeling verwijderd",
        "app.devices.emptyDeviceListTitle": "U heeft geen gekoppelde computers.",
        "app.devices.emptyDeviceListMessage": "Om een computer te koppelen moet u VMware Identity Manager Desktop voor Windows installeren en registreren.",

		"app.thinappMultiDeviceAct.heading":"Deze applicatie wordt aan goedgekeurde toestellen toegevoegd. Om \"{0}\" op andere toestellen te gebruiken dient u de naam van het toestel in de lijst hieronder te vinden en dan op de knop \"Aanvragen\" te klikken.",		
        "app.thinappMultiDeviceAct.tableColumn.deviceName":"Toestelnaam",
        "app.thinappMultiDeviceAct.tableColumn.requestStatus":"Status",
        "app.thinappMultiDeviceAct.button.request":"Aanvragen",
        "app.thinappMultiDeviceAct.activationState.deniedActivation":"Afgewezen",
        "app.thinappMultiDeviceAct.activationState.awaitingActivation":"In behandeling",
        "app.thinappMultiDeviceAct.activationState.activated":"Goedgekeurd",
        "app.thinappMultiDeviceAct.activationState.notActivated":"Niet-geactiveerd",
        "app.setAppPassword.heading":"Stel een wachtwoord voor de applicatie {0} in.",
        "app.setAppPassword.instruction":"Gebruik het formulier hieronder om een wachtwoord voor deze applicatie in. Het wachtwoord moet tenminste uit drie tekens bestaan.",
        "app.setAppPassword.label.password": "Wachtwoord",
        "app.setAppPassword.label.confirmPassword": "Wachtwoord bevestigen",
        "app.setAppPassword.label.generate": "Wachtwoord genereren",
        "app.setAppPassword.error.passwordsNoMatch": "Wachtwoorden komen niet overeen.",
        "app.setAppPassword.msg.success": "Uw applicatiewachtwoord is met succes ingesteld.",
        "app.setAppPassword.msg.fail": "Er is een fout opgetreden tijdens de poging om uw wachtwoord in te stellen. Probeer het opnieuw.",

        "app.store.app.name":"VMware Workspace ONE",
        "app.banner.install":"Installeren",
        "app.banner.open":"Openen",
        "button.cancel":"Annuleren",
        "myapps.launch.passwordvault.installExtension.description":"Deze app kan gebruik maken van de browser plug-in Password Vault. <a target='_blank' href='{0}'>Klik op deze link</a> om de plug-in te installeren, indien u dit nog niet gedaan heeft.",
        "installMessage.continueInstall":"U heeft al eerder geprobeerd deze app te installeren. ",
        "installMessage.proceedToInstall":"Klik om verder te gaan.",
        "appCenter.device.status.confError":"Het MDM-systeem was niet in staat om informatie voor uw toestel te vinden.",
        "appCenter.device.unEnrollWarningTitle":"Waarschuwing",
        "appCenter.device.mdmUnEnrollMessage":"Verwijder alle Workspace ONE-applicaties en -gegevens van dit toestel.",
        "appCenter.device.disableWorkspaceMessage":"Als u uw account verwijdert, worden alle toegangsrechten die via de Workspace ONE-app zijn verleend ingetrokken. Applicaties die naar uw startscherm zijn gedownload blijven geïnstalleerd, maar u kunt ze wellicht niet meer openen. Wilt u verdergaan?",
        "appCenter.internalApp.installationStepTitle":"Volg deze stappen na installatie om de applicatie te openen.",
        "appCenter.internalApp.step1":"Open Instellingen vanaf het startscherm op uw iPhone.",
        "appCenter.internalApp.step2":"Klik op Algemeen.",
        "appCenter.internalApp.step3":"Klik op Profielen of Beheer profielen en apparaten.",
        "appCenter.internalApp.step4":"Klik op de naam van een ontwikkelaar onder de kop Bedrijfsapp. ",
        "appCenter.internalApp.step5":"Controleer de app of verklaar de app vertrouwd.",
        "appCenter.internalApp.watchTutorial":"Bekijk de stapsgewijze instructies.",
        "userInfo.removeAccount":"Account verwijderen",
        "userInfo.account":"Account",
        "userInfo.password":"Wachtwoord",
        "app.changePassword.title":"Wachtwoord wijzigen",
        "app.changePassword.enterCurrentPassword":"Voer huidig wachtwoord in",
        "app.changePassword.enterNewPassword":"Voer nieuw wachtwoord in",
        "app.changePassword.confirmNewPassword":"Bevestig nieuw wachtwoord in",
        "app.changePassword.error.passwordsNoMatch":"Nieuw wachtwoord onjuist ingevoerd.",
        "app.changePassword.success":"Nieuw wachtwoord opgeslagen.",
        "app.changePassword.label.email":"E-mail",
        "app.changePassword.label.phone":"Telefoon",
        "app.logout.confirm.msg":"Als u uit Workspace ONE uitlogt, wordt uw huidige sessie beëindigd. Alle applicaties die uit de catalogus zijn gedownload blijven op het toestel aanwezig, maar nieuwe applicaties worden niet beschikbaar gesteld totdat u weer inlogt.",
        "app.logout.title":"WAARSCHUWING",
        "app.passwordVault.banner.msg":"U heeft applicaties die gebruik kunnen maken van de browser plug-in Password Vault.",
        "app.passwordVault.banner.button.install":"Installeren"
    });
})(angular.module('com.vmware.greenbox.l10n'));
