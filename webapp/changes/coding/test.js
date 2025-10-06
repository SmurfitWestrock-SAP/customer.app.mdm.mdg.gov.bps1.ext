sap.ui.define(["sap/ui/core/mvc/Controller", "mdm/mdg/gov/bps1/ext/utils/Attachment"], function (C, A) {
    "use strict"; return C.extend("mdm.mdg.gov.bps1.ext.controller.ProcessDataSectionReplace", { cMasterDataChangeProcess: "QuickCreate.MasterDataChangeProcess", cP+
        rocessTemplateField: "QuickCreate.ProcessTemplate", cProcessDataSection: "mdm.mdg.gov.bps1::sap.suite.ui.generic.template.ObjectPage.view.Details::BusinessPartner--ProcessData::SubSection", cSaveButtonId: "mdm.mdg.gov.bps1::sap.suite.ui.generic.template.Objec+
tPage.view.Details:: BusinessPartner--save",cActivateButtonId:"mdm.mdg.gov.bps1:: sap.suite.ui.generic.template.ObjectPage.view.Details:: BusinessPartner--activate",sPath:"",extensionAPI:null,onInit:function(e){var t=this;var p={fieldProperties:{CreateNewPr+
ocessSelectedIndex: 0, MasterDataChangeProcessEdit: false, MasterDataChangeProcessEnabled: true, MasterDataChangeProcessVisible: false, MasterDataChangeProcessValueState: sap.ui.core.ValueState.None, MDChgProcessDescriptionEdit: true, MDChgProcessDescriptionVisible: +
    true, MDChgProcessTypeIDEdit: true, MDChgProcessTypeIDVisible: true, templateDefaulted: false}}; var P = new sap.ui.model.json.JSONModel(p.fieldProperties); P.attachPropertyChange(function (_) {
        switch (_.getParameter("path")) {
            case "/CreateNewProcessSelectedIndex": this +
.setProperty("/MasterDataChangeProcessEdit", _.getParameter("value") === 0 ? false : true); this.setProperty("/MasterDataChangeProcessVisible", _.getParameter("value") === 0 ? false : true); if (_.getParameter("value") === 0) {
                    t.oView.getModel().setProperty(t.oView.getBindi +
                        ngContext().getPath() + "/MasterDataChangeProcessForEdit", ""); t.oView.getModel().submitChanges();
                } break; default:
        }
    }); e.getSource().setModel(P, "Properties"); e.getSource().attachModelContextChange(this.onContextChange.bind(this)); this.extensionAPI = sap.ui.getC +
        ore().byId("mdm.mdg.gov.bps1::sap.suite.ui.generic.template.ObjectPage.view.Details::BusinessPartner").getController().extensionAPI; this.extensionAPI.getTransactionController().attachAfterCancel(this._onAfterCancel.bind(this));}, _onAfterCancel: function(E+
) { var t = this; try { E.discardPromise.then(function () { t.oView.getModel("Properties").setProperty("/templateDefaulted", false); t.oView.getModel("Properties").setProperty("/CreateNewProcessSelectedIndex", 0); }); } catch (e) { } }, onContextChange: function(e) {
    var t = this +
; var b = this.oView.getBindingContext(); if (b && (b.sPath !== this._contextPath && b.getObject() && b.getObject().to_Process && b.getObject().to_Process.__deferred)) {
        this._contextPath = b.sPath; var a = b.getObject(); var B = this.oView.getModel().createKey("/BusinessPartner+
",{BusinessPartnerUUID:a.BusinessPartnerUUID,MasterDataChangeProcess:a.MasterDataChangeProcess,MDChgProcessSrceSystem:a.MDChgProcessSrceSystem,MDChgProcessSrceObject:a.MDChgProcessSrceObject,IsActiveEntity:a.IsActiveEntity});t.oView.getModel().read(B+" / t +
            o_Process",{success:function(d){if(d&&d.MasterDataChangeProcessForEdit&&d.MasterDataChangeProcessForEdit!=0){t.oView.getModel("Properties").setProperty(" / CreateNewProcessSelectedIndex",1);if(d.MasterDataChangeProcessForEdit_fc){t.oView.byId("QuickCreate.+
        ProcessData.RadioButtonGroup").setEditable(d.MasterDataChangeProcessForEdit_fc!==1);}}else{t.oView.getModel("Properties").setProperty(" / CreateNewProcessSelectedIndex",0);t.oView.byId("QuickCreate.ProcessData.RadioButtonGroup").setEditable(true);}},error:+
function (d) { }, urlParameters: { $select: 'MasterDataChangeProcessForEdit,MasterDataChangeProcessForEdit_fc' }});
}}, onBeforeRendering: function(E) {
    var p = this.getView().byId(this.cProcessTemplateField); if (p) {
        var a = function (c) {
            c.getBinding("items").filter(new sap +
.ui.model.Filter({ filters: [new sap.ui.model.Filter({ path: "MDChgProcessGoal", operator: "EQ", value1: "G" }), new sap.ui.model.Filter({ path: "MDChgProcessSrceObjectTypeCode", operator: "EQ", value1: "986" })], and: true }));
        }; var d = {
            onBeforeRendering: function (b) {
                if (this +
&& !this.data("processGoalFilterSet") && this.getItems().length > 0) { this.data("processGoalFilterSet", true); a(this); }
            }
        }; var c = p.getInnerControls() && p.getInnerControls()[0]; try {
            if (c && c.getEditable()) { c.addEventDelegate(d, c); } else {
                p.attachInnerControlsCreated(f +
                    unction(b){ c=this.getInnerControls()[0]; if(c&& c instanceof sap.m.ComboBox && c.getEditable()){ c.addEventDelegate(d, c); }
            });
        }}catch (e) { }
}}, onMasterDataChangeProcessChange: function(e) { this._executeSideEffects(["to_Process/MasterDataChangeProcessForEdit"]); }, _ +
    executeSideEffects: function(s) { this.extensionAPI.getTransactionController().executeSideEffects({ sourceProperties: s }); }, getProcessDataLabel: function() { return ""; }, getProcessTooltip: function(i) { return !i || i == 0 ? "" : i.replace(/^0+/, ''); }, formatAttachmentLink: fu +
        nction(v){ return this.getView().getModel("i18n").getResourceBundle().getText("AttachmentNo", [v || "0"]); }, onOpenAttachments: function(e) {
            new A({
                extensionAPI: this.extensionAPI, parentController: this, process: e.getSource().getModel().getProperty(e.getSource().g +
                    etBindingContext().getPath())
            }).open();
        }});});