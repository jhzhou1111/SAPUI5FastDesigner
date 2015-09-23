/**
  * Mng the OData metadata , now only support one Metadata
  * */
var go;
fd.model.ODataMng = {
		
	init: function() {
		this._oModel = new sap.ui.model.json.JSONModel();
		this._oModel.setSizeLimit(1000);
		this.oDataUrl = "";   //means not contain $metadata
	},

	getModel: function( ) {
	    return this._oModel;
	},
	
	getODataMetadaUrl: function( evt ) {
	    return this.oDataMetadataUrl;
	},
	
	onOkPressed: function() {
		if ( this._oRBUrl.getSelected()) {
			var url = this._oUrlControl.getValue().trim();
			if (!url) {
				fd.uilib.Message.warning("Please enter URL");
				return;
			} else {
				//some case user input the /$metadata, in this case just simple remove it 
				url = url.replace("/$metadata", "");
				this.oDataUrl = url;

				this.oDataModel  = new  sap.ui.model.odata.ODataModel(url, true);
				this.oDataModel.attachMetadataFailed( this.onODataMetadataFailed, this);
				this.oDataModel.attachMetadataLoaded( this.onODataMetadataLoad, this);
				this._oDialog.close();
			}
		} else {
			if ( this._oContentControl.getValue().trim().length === 0) {
				fd.uilib.Message.warning("Please input OData Metadaa content");
				return;
			}

			if (this.parseMetadata( this._oContentControl.getValue())) {
				this._oDialog.close();	
			} else {
				this._oContentControl.setValue("");
			}
		} 
	},

onODataMetadataFailed: function( oEvent ) {
	var brief = oEvent.getParameter("message");
	var detail = "";
	var resp  = oEvent.getParameter("response");
	detail = resp.body ? resp.body : "";

	fd.uilib.Message.showErrors("Get metadata failed", [ brief, detail]);
	console.error("load fail", oData);
},

onODataMetadataLoad: function( oEvent ) {
	var oData = oEvent.getParameter('metadata').oMetadata;
	this.processODataMetada(oData);

    // console.error("load suss", oData);
},



	//!! how to get from odata
//om.getMetaModel().oModel.oData
// om.attachMetadataFailed
// ODataModel.attachMetadataFailed(oData, fnFunction, oListener)
// om.attachMetadataLoaded
// ODataModel.attachMetadataLoaded(oData, fnFunction, oListener)
// 

	onOpenFromFileChanged: function(evt) {
		this._oOpenFileChoose.startRead();
	},
	
	/**
	 * Call back for open all the file content
	 * @param evt
	 */
	onOpenFromFileLoadOne: function(evt) {
		if (evt.getParameter("success")) {
			var content = evt.getParameter("content");
			if (this.parseMetadata(content)) {
				this._oDialog.close();	
			}
		}
	},

	onClearButtonPressed:     function ( evt) {
	    this._oContentControl.setValue("");
		this._oUrlControl.setValue("");
	},

	buildChooseDialog: function() {
		var btnOk = new sap.ui.commons.Button({
			text: "Ok",
			press: [this.onOkPressed, this]
		});
		btnOk.addStyleClass("FDLeftMargin");

		var btnCancel = new sap.ui.commons.Button({
			text: "Cancel",
			press: [function() {
				this._oDialog.close();
			}, this],
		});

		var btnClear = new sap.ui.commons.Button({
			text: "Clear",
			press: [this.onClearButtonPressed, this],
		});

		//now open from file need special control
		var openFileBtn = new sap.ui.commons.Button(
				{
					text: "Open From Files",
					width: "20rem",
					style: "Emph"
				});

		this._oOpenFileChoose = new fd.uilib.FileChoose({
			buttonControl : openFileBtn,
			accept :"text/xml",
			multiple: false,
			change: [this.onOpenFromFileChanged, this],
			loadOne: [this.onOpenFromFileLoadOne, this]
		}).addStyleClass("FDLeftMargin");
		// .addStyleClass("FDTopMarginHalf")

		this._oUrlControl = new sap.ui.commons.TextField({
			width: "50rem",
			placeholder: "such as placeholder https://ldciq95.wdf.sap.corp:9501/sap/opu/odata/sap/FAP_REVISE_PAYMENT_PROPOSAL",
			change: function(evt) {
				//need update to the global setting also
				fd.getSettingController().setODataUrlIfEmpty ( evt.getSource().getValue() );
			}
		}).addStyleClass("FDLeftMargin");
		
		this._oContentControl = new sap.ui.commons.TextArea({ 
			width: "50rem",
			rows: 10
		}).addStyleClass("FDLeftMargin");

		/*this._oRBFile = new sap.ui.commons.RadioButton({text: "Load from File",
			selected: true
		}).addStyleClass("FDTopMargin");*/

		this._oRBUrl = new sap.ui.commons.RadioButton({
			text: "Load from URL (only support run in local model and disable security) !!not support now",
			// enabled: false,
			selected: true
			
		}).addStyleClass("FDTopMargin");
		this._oRBContent = new sap.ui.commons.RadioButton({text: "Directly load file content",
			// selected: true
		}).addStyleClass("FDTopMargin");
		
		var content = new sap.m.VBox({
			items: [
				// new sap.m.HBox({
				// 	items: [
						// this._oRBFile,
						// this._oOpenFileChoose,
				// 	]
				// }),

				this._oRBUrl,
				this._oUrlControl,

				this._oRBContent,
				this._oContentControl
			]
		});

		

		var dialog = new sap.ui.commons.Dialog({
			title: "Load the OData Metadata",
			buttons: [this._oOpenFileChoose, btnOk, btnCancel, btnClear],
			content: content,
		});
		return dialog;
	},

	openODataLoadDialog: function() {
		if ( !this._oDialog ) {
			this._oDialog = this.buildChooseDialog();
		} else {
			this.onClearButtonPressed();
		}
		this._oDialog.open();
	},

	/**
	 * [parseMetadata description]
	 * @param  {[type]} content [description]
	 * @return {[type]}         [description]
	 */
	parseMetadata: function( content ) {
		//just use simple way to check whether is ok or not
		try {
			$.parseXML(content);
		} catch (e) {
			fd.uilib.Message.showErrors("Invalid $metadata file", [ e.message]);
			return false;
		}

		//just use the OData internal method to parse the xml, so later can use the same model as the normal load by url
		var response = {
			headers: {
				"Content-Type": "application/xml",
				"DataServiceVersion": "2.0",
			},
			statusCode: 200,
			statusText: "OK",

			body: content
		};

		var metaHandler = OData.metadataHandler;
		var ret = metaHandler.read(response);
		if (!ret) {
			fd.uilib.Message.showErrors("Parse $metadata failed", ["Please check the file content and retry"]);
		} else {
			this.processODataMetada( response.data);
		}
		return true;
	},




	/**
	 * Get the entity set, entity, annotation as array so later can use easily
	 * @param  {[type]} odata [description]
	 * @return {[type]}       [description]
	 */
	processODataMetada: function( odata) {
		if ( ! (odata.dataServices && odata.dataServices.schema && odata.dataServices.schema.length ===1) ){
			alert("Parsed OData error, please check the OData!");
			return;
		} 

		this._mData = {};
		this._mData.schema = odata.dataServices.schema[0];

		this._mData.aEntityType = [{
			key: "",
			name: "--First select one Entity then choose properties:--"
		}];
		for (var i=0; i < this._mData.schema.entityType.length; i++) {
			this._mData.aEntityType.push({
				key: this._mData.schema.entityType[i].name,
				name: this._mData.schema.entityType[i].name,
			});
		}

		/*//get the useful names: entityType, entitySet, annotation
		 = fd.util.getArrayFromArrayByKey(this._mData.schema.entityType, "name" );
		
		if ( this._mData.schema.entityContainer[0] && this._mData.schema.entityContainer[0].entitySet) {
			this._mData.aEntitySetName = fd.util.getArrayFromArrayByKey( this._mData.schema.entityContainer[0].entitySet, "name" );
		} else {
			this._mData.aEntitySetName = [];
		}

		this._mData.aAnnotationName =  fd.util.getArrayFromArrayByKey( this._mData.schema.annotations, "target");	*/

		//Now data is ready, so can set
		this._oModel.setData( this._mData);

		fd.uilib.Message.showToast("Load OData $metada successful!");

		//??
		go = this._mData;
	},

	/**
	 * Get the whole entity name path
	 * @param  {[type]} evt [description]
	 * @return {[type]}     [description]
	 */
	getEntityNamePath: function( evt ) {
	    return "/aEntityType";
	},

	/**
	 * use for get property for one entity
	 * @param  {[type]} entity [description]
	 * @return {[type]}        [description]
	 */
	getEntityPath: function( entity ) {
		//first by entity name get the position
		var idx = this._mData.schema.entityType.sapIndexOf("name", entity);
		fd.assert( idx !== -1,  "Logic error as should get the entity");

		return "/schema/entityType/" + idx + "/property"; 
	},
	

	isMetadataLoad: function() {
		return this._mData;
	},

	isFirstTimePrompt: function( evt ) {
	    return this._bIsFirstTimePrompt;
	},

	setIsFirstTimePrompt : function( flag ) {
	    this._bIsFirstTimePrompt = flag;
	},
	
	
	_mData: null,  //the odata metadata internal structure 
	_oDialog: null,

	_bIsFirstTimePrompt: true,
};
