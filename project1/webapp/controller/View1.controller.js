sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/m/p13n/Engine',
	'sap/m/p13n/SelectionController',
	'sap/m/p13n/SortController',
	'sap/m/p13n/GroupController',
	'sap/m/p13n/MetadataHelper',
	'sap/ui/model/Sorter',
	'sap/ui/table/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Engine, SelectionController, SortController, GroupController, MetadataHelper, Sorter, library) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
            
            var oController = this;

            var jsonFileUrl = sap.ui.require.toUrl("project1/mockdata/TablePerso.json");

            $.ajax({
                url: jsonFileUrl,
                dataType: "json",
                success: function (data) {
                    var oModel = new JSONModel(data);
                    oController.getView().setModel(oModel);
                    oController._registerForP13n();
                },
                error: function (err) {
                    console.error("Error loading JSON file", err);
                }
            });



                /* var oData = {
                    items: [
                        {firstName: "Peter", lastName: "Mueller", size: "1.75", city: "Walldorf"},
                        {firstName: "Petra", lastName: "Maier", size: "1.85", city: "Walldorf"},
                        {firstName: "Thomas", lastName: "Smith", size: "1.95", city: "Walldorf"},
                        {firstName: "John", lastName: "Williams", size: "1.65", city: "Walldorf"},
                        {firstName: "Maria", lastName: "Jones", size: "1.55", city: "Walldorf"}
                    ]
                };
    
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel); */
                //this._registerForP13n();

            },

            _registerForP13n: function() {
                var oTable = this.byId("evasoriTable");
                
                var oData = this.getView().getModel().getData(); // Get the entire JSON data
            
                this.oMetadataHelper = new MetadataHelper(oData.columns); // Use the "columns" array for metadata
            
                Engine.getInstance().register(oTable, {
                    helper: this.oMetadataHelper,
                    controller: {
                        Columns: new SelectionController({
                            targetAggregation: "columns",
                            control: oTable
                        })
                    }
                });
            
                Engine.getInstance().attachStateChange(this.handleStateChange.bind(this));
            },
            
    
            handleStateChange: function(oEvt) {
                var oTable = this.byId("evasoriTable");
    
                
                var oState = oEvt.getParameter("state");
    
                oTable.getColumns().forEach(function(oColumn){
                    oColumn.setVisible(false);
                    //oColumn.setSorted(false);
                });
    
                oState.Columns.forEach(function(oProp, iIndex){
                    var oCol = this.byId(oProp.key);
                    oCol.setVisible(true);
    
                    oTable.removeColumn(oCol);
                    oTable.insertColumn(oCol, iIndex);
                }.bind(this));
            },
    
            openPersoDialog: function(oEvt) {
                var oTable = this.byId("evasoriTable");
    
                Engine.getInstance().show(oTable, ["Columns"], {
                    contentHeight: "35rem",
                    contentWidth: "32rem",
                    source: oEvt.getSource()
                });
            },
        });
    });
