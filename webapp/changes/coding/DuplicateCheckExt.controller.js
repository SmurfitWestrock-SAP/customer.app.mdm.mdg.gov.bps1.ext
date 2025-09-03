/*
 * Copyright (C) 2009-2023 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/base/ManagedObject", "sap/ui/core/routing/History", "sap/m/TablePersoController"], function (M, H, T) {
    "use strict";
    return M.extend("mdm.mdg.gov.bps1.ext.controller.DuplicateCheckExt", {
        cResultTable: "mdm.mdg.gov.bps1::sap.suite.ui.generic.template.ListReport.view.ListReport::BusinessPartner--responsiveTable ",
        cButtonGo: "mdm.mdg.gov.bps1::sap.suite.ui.generic.template.ListReport.view.ListReport::BusinessPartner--listReportFilter - btnGo ",
        metadata: {
            properties: {
                extensionAPI: {
                    type: "any "
                },
                parentController: {
                    type: "any"
                },
                dialog: {
                    type: "any"
                }
            }
        },

        // Copie du controller Standard "DuplicateCheck" afin d'appeller l'action "DuplicateCheckApprov" lors du flux d'approbation
        // La Dialog est basé sur le fragment Standard
        cNewRecordTable: "mdm.mdg.gov.bps1.NewRecordTable",
        cDuplicatesTable: "mdm.mdg.gov.bps1.DuplicatesTable",
        onBeforeRebindTable: function (e) {
            var b = e.getParameter("bindingParams");
            b.startIndex = 0;
            b.length = 10000000;
        },
        onBeforeRebindDuplicatesTable: function (e) {
            var b = e.getParameter("bindingParams");
            b.startIndex = 0;
            b.length = 10000000;
        },
        startDuplicateCheck: function () {
            var t = this;
            var a = "/DuplicateCheckApprov";
            var c = t.getParentController().getView().getBindingContext();
            var u = {};
            var e = false;
            sap.ui.getCore().getMessageManager().removeAllMessages();
            var p = t.getExtensionAPI().invokeActions(a, c, u);
            p.then(function (r) {
                if (r[0].response.data.results && r[0].response.data.results.length > 0) {
                    t.oLocalModel = new sap.ui.model.json.JSONModel();
                    var n = [];
                    n.push(r[0].response.data.results[0]);
                    var d = [];
                    d = r[0].response.data.results;
                    d.splice(0, 1);
                    t.oLocalModel.setProperty("/NewRecord", n);
                    t.oLocalModel.setProperty("/Duplicates", d);
                    t._openDuplicateDialog();
                } else if (r[0] && r[0].response) {
                    var m = sap.ui.getCore().getMessageManager().getMessageModel().getData();
                    sap.ui.getCore().getMessageManager().removeAllMessages();
                    $.each(m, function (i, o) {
                        sap.ui.getCore().getMessageManager().addMessages(new sap.ui.core.message.Message({
                            message: o.message,
                            type: o.type,
                            code: o.code,
                            descriptionUrl: o.descriptionUrl
                        }));
                        e = (o.type === sap.ui.core.MessageType.Error || o.type === sap.ui.core.MessageType.Warning);
                        if (o.type === sap.ui.core.MessageType.Warning || o.type === sap.ui.core.MessageType.Warning) {
                            e = true;
                            sap.m.MessageBox.warning(o.message, {
                                styleClass: "sapUiSizeCompact",
                                actions: [sap.m.MessageBox.Action.OK],
                                emphasizedAction: sap.m.MessageBox.Action.OK,
                                onClose: function (A) {}
                            });
                        }
                    });
                    if (!e) {
                        var R = t.getParentController().getView().getModel("i18n|sap.suite.ui.generic.template.ObjectPage|DuplicateCheck").getResourceBundle();
                        var s = R.getText("DuplicateNotFound");
                        sap.m.MessageBox.information(s, {
                            styleClass: "sapUiSizeCompact",
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: sap.m.MessageBox.Action.OK,
                            onClose: function (A) {}
                        });
                    }
                }
            });
        },
        constructor: function () {
            M.apply(this, arguments);
        },
        _openDuplicateDialog: function () {
            var t = this;
            sap.ui.core.Fragment.load({
                name: "mdm.mdg.gov.bps1.ext.fragment.DuplicateCheckDialog",
                controller: this
            }).then(function (d) {
                d.setModel(t.oLocalModel, "data");
                t.getParentController().getView().addDependent(d);
                d.open();
                d.attachAfterClose(function () {
                    t.getParentController().getView().removeDependent(d);
                    d.destroy();
                    t.destroy();
                });
                t.setDialog(d);
                var n = sap.ui.getCore().byId(t.cNewRecordTable);
                var p = {
                    getPersData: function (e) {
                        var N = sap.ui.getCore().byId(t.cNewRecordTable);
                        var o = sap.ui.getCore().byId(t.cDuplicatesTable);
                        var a = N.getTable().getColumns();
                        var b = o.getTable().getColumns();
                        for (var i = 0; i < b.length; i++) {
                            var c = b[i].getCustomData();
                            var s = c[0].getProperty("value").columnKey;
                            var C = false;
                            for (var f = 0; f < a.length; f++) {
                                var g = a[f].getCustomData();
                                var h = g[0].getProperty("value").columnKey;
                                var v = a[f].getVisible();
                                if (s === h) {
                                    b[i].setVisible(v);
                                    C = true;
                                }
                            }
                            if (s === "data>MDChgProcessMatchRule" || s === "data>MDChgProcessMatchScoreValue") {
                                b[i].setVisible(true);
                            } else if (!C) {
                                b[i].setVisible(false);
                            }
                        }
                        N.rebindTable();
                        o.rebindTable();
                        var j = new jQuery.Deferred();
                        if (!this._oBundle) {
                            this._oBundle = undefined;
                        }
                        var B = this._oBundle;
                        j.resolve(B);
                        return j.promise();
                    },
                    setPersData: function (b) {
                        var o = new jQuery.Deferred();
                        this._oBundle = b;
                        o.resolve();
                        return o.promise();
                    },
                    delPersData: function () {
                        var o = new jQuery.Deferred();
                        o.resolve();
                        return o.promise();
                    }
                };
                t.oTPC = new T({
                    table: n.getTable(),
                    componentName: "mdm.mdg.gov.bps1.Component",
                    persoService: p
                }).activate();
                n.setModel(t.oLocalModel, "data");
                var D = sap.ui.getCore().byId(t.cDuplicatesTable);
                D.setModel(t.oLocalModel, "data");
            });
        },
        fmtEntityTypeDescription: function (v, d) {
            if (v && d) {
                return d + " (" + v + ")";
            } else {
                return "";
            }
        },
        onDuplicatePressed: function (e) {
            // var o = e.getSource().getBindingContext("data").getOb +
            //     ject();

            // function a(d, m) {
            //     var l = "";
            //     for (var i = 0; i < m - d.length; i++) {
            //         l = "0" + l;
            //     }
            //     return l + d;
            // }
            // if (e.getId() === "navigationTargetsObtained") {
            //     var A = [];
            //     var b = o.BusinessPartner;
            //     if (!isNaN(b)) {
            //         b = a(b, 10);
            //     }
            //     var c = e.getParameter("ownNavigation");
            //     c.setProperty("key", "BusinessPartner - govern ");
            //     c.setProperty("text ", "Manage Business Partner - Central Governance ");
            //     c.setHref("# " + c.getKey() + " ? BusinessPartnerUUID = guid '00000000-0000-0000-0000-000000000000' & MasterDataChangeProcess = 0 " + " & MDChgProcessSrceSystem = & MDChgProcessSrceObject = " + b + "&IsActiveEntity=true");
            //     A.push(c);
            //     var C = new sap.m.Label({
            //         text: o.BusinessPartner
            //     });
            //     C.addStyleClass("sapUiSmallMarginBegin");
            //     var _ = $.extend({}, e);
            //     if (_) {
            //         _.getParameter("show")(o.BusinessPartnerFullName, _.getParameter("mainNavigation").setText(""), A, C);
            //         _ = nul +
            //             l;
            //     }
            // }
        },
        onDuplicateContinue: function (e) {
            var t = this;
            t.getDialog().close();
        }
    });
});