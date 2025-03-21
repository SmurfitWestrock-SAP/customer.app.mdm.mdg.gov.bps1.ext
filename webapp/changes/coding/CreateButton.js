sap.ui.define(
    [
        'sap/ui/core/mvc/ControllerExtension'
    ],
    function (
        ControllerExtension
    ) {
        'use strict';
        return ControllerExtension.extend("customer.app.mdm.mdg.gov.bps1.ext.CreateButton", {
            override: {
            	onBeforeRendering: function() {
                    // const oCreateButton = this.getView().byId("mdm.mdg.gov.bps1::sap.suite.ui.generic.template.ListReport.view.ListReport::BusinessPartner--Create");
                    // oCreateButton.setEnabled(false);                    
                    // oCreateButton?.bindProperty("enabled", { path: "/ZZCreationAuth(1)/Authorized" });
                    // this.getView().getModel().read("/ZZCreationAuth(1)");
                    
            	}
            }
        });
    }
);
