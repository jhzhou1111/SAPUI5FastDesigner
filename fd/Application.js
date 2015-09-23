//create the base namespace
//alert("In Application");
fd={};
fd.view = {};
fd.util = {};
fd.model= {};
fd.cfg = {};
fd.uilib = {};
fd.cfg = {};

fd.crlf = "\r\n";
fd.crlf2 = "\r\n\r\n";
fd.InputType = {
		ViewController 			: "vc",
		Fragment                :  "Fragment",
		ViewControllerFromFile          : "vcFromFile",
		ViewContent				: "ViewContent",  //view string content
		AllControl     			:"AllControl",    //select one control to add to the tree
		Aggregation    			:"Aggregation",   //used to select one control for the aggregation
};

fd.assert = jQuery.sap.assert;
fd.error = function() {
	if (console.error) {
		console.error(arguments);
	}
};

fd.log = function() {
	if (console.log) {
		console.log(arguments);
	}
};

/**
 * Some meta for an control
 */
fd.MetaType ={
	Prop: "Prop",
	Asso: "Asso",
	Event:"Event",
	Aggr:   "Aggr",
	
	//Extra: "Extra"
};

fd.NodeType = {
		Root:"Root",
		Html:"Html",  //the html control, such as h1
		Ui5: "Ui5",   //the ui5 control, sap.m.Button
		Aggr:"Aggr"   //the aggregation, such as"content" for a Page
};

fd.ViewType = {
		Xml: 	'xml',
		Html :"html",
		Json: "json",
		Js  :  "Js",
		Unknown:"Unknown"
};

fd.PreviewType = {
	Desktop:   "Desktop",
	Phone   : "Phone",  
	//following is iPad
	FullApp: "FullApp",
	Master: "Master",
	Slave:  "Slave"
};

//two common used string
fd.StrControl ="sap.ui.core.Control";
fd.StrElement ="sap.ui.core.Element";
fd.StrCoreView ="sap.ui.core.View";
fd.StrFragment = "sap.ui.core.Fragment";
fd.StrFragmentDefinition = "sap.ui.core.FragmentDefinition";
fd.StrExtPoint = "sap.ui.core.ExtensionPoint";

//The property type, used to know how to proivder corresponding control for it, get data from sap.m, commons, form
//??any new type
fd.PropType = {
	'Boolean':"Boolean",
	'String' :"String",  //now also contain any, object, int, float
	'Enumable' :  "Enumable",  //means can choose from ComboBox 
	'Checkable' :"Checkable",  //like sap.ui.core.CSSSize, use TextFiled to edit, but can check whether is valid or not
	'Number'    :"Number",
};

fd.SourceType = {
	Xml: 	"xml",
	Html:  "Html",
	Json:  "Json",
	Js  :   "Js",
	Other:  "Other"
};

/**
 * Three different class type, need from it to know how to get the candidate
 */
fd.ClassType = {
	Element:"Element",
	Control:"Control",
	Interface:"Interface",   //such as sap.ui.commons.ToolbarItem,
	Unknown:"Unknown"
};

jQuery.sap.declare('fd.Application');
jQuery.sap.require('sap.ui.app.Application');  

/**
 * The global main controller, from it can find all the sub view information
 * @return {[type]} [description]
 */
fd.getMainController = function() {
	return fd._oMainController;
};

fd.setMainController = function(mainController) {
	//the main controller will set itself
	fd._oMainController = mainController;
};

fd.getProjectController = function() {
	return fd._oProjectController;
};

fd.setProjectController = function(prjController) {
	//the main controller will set itself
	fd._oProjectController = prjController;
};

fd.setSettingController = function( controller ) {
    this._oSettingController = controller;
};

fd.getSettingController = function( controller ) {
    return this._oSettingController;
};


/**
 * Used to create unique id for tree node, so later can easily add outline
 * @type {Number}
 */
fd.treeNodeIndex=0;
fd.getNextTreeNodeIndex = function() {
	fd.treeNodeIndex++;
	return "FDTreeNode_" + fd.treeNodeIndex;
}


sap.ui.app.Application.extend('fd.Application',
{
	init: function() {

		var bus = sap.ui.getCore().getEventBus();
		//as so many part need use it
		fd.bus = bus;
		fd.core = sap.ui.getCore();

		fd.model.TextMng.init();
		fd.model.EnumMng.init();
		fd.model.Metadata.init();
		fd.model.ModuleMng.init();
		fd.model.ODataMng.init();
		fd.model.CodeAssist.init();
		fd.model.TypeMng.init();
		fd.model.SampleMng.init();
		fd.model.ImageMng.init();
	},
	
	main: function() {
		// create app view and put to html root element
		var root = this.getRoot();
		sap.ui.jsview("app", "fd.view.Main").placeAt(root);
	}
});
			
			