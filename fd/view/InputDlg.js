jQuery.sap.declare("fd.view.InputDlg");
jQuery.sap.require("sap.ui.commons.Dialog");
var gCB;
/**
 * As there are several place need get the input value, so can use one common
 * InputDlg, and depend on the type it will create needed input
 */
sap.ui.commons.Dialog.extend("fd.view.InputDlg", {
			metadata : {
				properties : {
					inputType : "string",   //??why here fd.InputType will fail
					//some call back information
					/*cbFunc: "object",
					cbContext: "objct",
					cbData: "object",   
					*/
				}
				,
			},

			renderer :"sap.ui.commons.DialogRenderer",

			createContentForViewControlName: function(data) {
				// just use the simple Form
				
				this._aTextFields = [];

				//just use the simple layout for it
				var vLayout = new sap.ui.commons.layout.VerticalLayout();
				
				for (var i = 0; i < data.labels.length; i++) {
					var name = data.labels[i];

					//first create for label
					var sWidth ="12em";
					var label = new sap.ui.commons.Label({
								text : name,
								width: sWidth  //so it will be aligned
							});

					//then for text field				
					sWidth ="300px";
					var tf = new sap.ui.commons.TextField({width: sWidth});
					/*if (data.mandatory[i]) {
						tf.setPlaceholder('mandatory');
					} else {
						
					}*/
					
					label.setLabelFor(tf);

					this._aTextFields.push(tf);

					vLayout.addContent(
							new  sap.ui.commons.layout.HorizontalLayout({
								content : [label, tf]
							})
					);
					
					//??change later, for seperate
					vLayout.addContent( new sap.ui.core.HTML( {content: "<div style='height:1em'></div>"}) );
					
				}
				
				return vLayout;
	
			},
			
			createContentForViewContent: function(data) {
				
				this._aTextFields = [];

				//just use the simple layout for it
				var vLayout = new sap.ui.commons.layout.VerticalLayout();
				
				
				for (var i = 0; i < data.labels.length; i++) {
					var name = data.labels[i];

					var sWidth ="15em";
					
					var label = new sap.ui.commons.Label({
								text : name,
								width: sWidth  //so it will be aligned
							});
									
					sWidth ="600px";
					
					var control;
					
					if (i ==0) {
						control = new sap.ui.commons.RadioButtonGroup("FormatChoice",
								{
									columns: 2,
									items: [ 
									         new sap.ui.core.Item({text:"XML View"}),
									         new sap.ui.core.Item({text:"HTML View"})
									        ]
								});
						control.setSelectedIndex(0);
						
						this._viewFmtChoice = control;
					} else {
						if ( data.rows[i] ==1) {
							control = new sap.ui.commons.TextField({width: sWidth});	
						} else {
							control = new sap.ui.commons.TextArea({width: sWidth, rows:  data.rows[i]});
						}
							
						this._aTextFields.push(control);
					}
					
					label.setLabelFor(control);

					vLayout.addContent(
							new  sap.ui.commons.layout.HorizontalLayout({
								content : [label, control]
							})
					);
					
					//??change later, for separator
					vLayout.addContent( new sap.ui.core.HTML( {content: "<div style='height:1em'></div>"}) );
				}
				
				return vLayout;
	
			},
			
			createContentForAllcontrol: function(data) {
				//??here just get the contorl, so for the element it will no chance to get it
				var arr = fd.model.ModuleMng.getControls();
				//we need create an array which like the {name: } in order for data binding
				for ( var i = 0; i < arr.length; i++) {
					var name = arr[i];
					this._aChoiceData.push( {'name': name});
				}
				
				var model = new sap.ui.model.json.JSONModel();
				model.setSizeLimit(1000);  //as the default size is 100, so need adjust it
				model.setData( this._aChoiceData);
				
				// Create a ComboBox  sap.ui.commons.ComboBox
				var oCB = new sap.ui.commons.DropdownBox("ChoiceForAllControl", 
							{
								displaySecondaryValues: true,
								width:        "320px",
								maxPopupItems : 20,
								change		  :	[this.onComboBoxSeletedChanged,this],
								// searchHelpEnabled  : true
							}
				);
				var template =  new sap.ui.core.ListItem( 
					{
					text: {
						path: "name",
						formatter: function(v) {
							return v.sapLastPart();
						}
					},
					key:  "{name}",
					additionalText: {
						path: "name",
						formatter: function(v) {
							if (v != null) {
								var pos = v.lastIndexOf(".");
								return v.substr(0,pos);
							}
						}
					}

				});   
				oCB.setModel( model);
				oCB.bindItems( "/",  template);
				
				//save it for later ref
				this._model = model;
				this._oComboBox = oCB;
				gCB = oCB;
				
				
				this._oInsertDftCheckbox = new sap.ui.commons.CheckBox({checked: true, text: "Insert default property/aggregaton/events also?"});
				
				
				//also add a text field so user can add his own controlname
				var tf = new sap.ui.commons.TextField({width:"600px", placeholder:"Input your own full control name here"});
				tf.addStyleClass('MarginTopBottom');
				this._aTextFields.push( tf);
				
				var label  = new sap.ui.commons.Label({text: "Or choose from list box. Tips: Type the name for fast search."});
				label.addStyleClass('MarginTopBottom');
				label.setLabelFor(this._oComboBox);
				
				//also add a lable to display the selected key:
				
				this._selectedClasslabel = new sap.ui.commons.Label({design:'Bold'});
				this._selectedClasslabel.addStyleClass('MarginLeftRight');
				
				this._oFilterNameLabel = new sap.ui.commons.Label({text: "Filtered by name:", visible:false});
				this._oFilterNameValue = new sap.ui.commons.Label({design:'Bold'});
				this._oFilterNameValue.addStyleClass('MarginLeftRight');
				
				
				var hbox1 = new sap.ui.layout.HorizontalLayout({
					content:[
					         	new sap.ui.commons.Label({text: "Selected Class:"}),
					         	this._selectedClasslabel,
					         	
					         	this._oFilterNameLabel,
					         	this._oFilterNameValue,
					         ]
				});
				hbox1.addStyleClass('MarginTopBottom');
				
				var restrictLibBtn = new sap.ui.commons.Button( {
					text:"Restrict by library",
					press: [this.onRestrictLibButtonPressed, this],
				});
				restrictLibBtn.addStyleClass('MarginLeftRight');

				/*var restrictItemBtn = new sap.ui.commons.Button( {
					text:"Restrict by name",
					press: [this.onRestrictNameButtonPressed, this],
				});
				restrictItemBtn.addStyleClass('MarginLeftRight');
				
				var clearnRestrictItemBtn = new sap.ui.commons.Button( {
					text:"Clear name restriction",
					enabled: false,
					press: [this.onClearRestrictNameButtonPressed, this],
				});
				this._oClearnRestrictItemBtn = clearnRestrictItemBtn;
				*/
				var hbox2 = new sap.ui.layout.HorizontalLayout( {
						content: [this._oComboBox, restrictLibBtn 
						/*,restrictItemBtn,clearnRestrictItemBtn */
						]
				});
				
				var vLayout = new sap.ui.commons.layout.VerticalLayout(
						{
							content: [
							          	this._oInsertDftCheckbox,
							          	tf,
							          	label,
							          	hbox1,
							          	hbox2,
							          ]
						});
				
				//??need from the setting know what is the default choice, now tmp use sap.m.Page
				this.setComboBoxInitialSelectedKey("sap.m.Page");
				
				return vLayout;
			},

			/**
			 * Call back for user open dialog and select different lib with previous, then need change the combo box candidates
			 */
			onSelectedLibDifferentWithPrevious: function() {
				var choseLib = fd.model.ModuleMng.getChoseLib();
				var filters = [];
				choseLib.forEach( function(lib) {
					filters.push( new sap.ui.model.Filter('name',"StartsWith", lib + "."));
				});
				//here need a copy 
				this._aLibFilter = filters.slice(); 
				
				//if this time set the filter by name also then need put them together
				// if (this._oNameFilter) {
				// 	filters.push(this._oNameFilter);
				// } 
				
				var binding = this._oComboBox.getBinding('items');
				binding.filter(filters);
				
				this.setComboBoxInitialSelectedKey();
			},
			
			onRestrictLibButtonPressed: function() {
				fd.model.ModuleMng.showLibSelectionDialog(this.onSelectedLibDifferentWithPrevious, this);
			},
			
			/**
			 * For simple, just use prompt to get user input
			 */
			onRestrictNameButtonPressed:function() {
				var name = prompt("Filtered by class name. Only valid for this time.");
				if (!name)
					return;

				name = name.trim();
				if (name.length === 0) {
					return;
				}
				
				//save it so can reset it, as it need combine with libs, so need"and" relation 
				var singleFilter = new sap.ui.model.Filter('name',"Contains", name);
				this._oNameFilter  = new sap.ui.model.Filter([singleFilter], true);
				
				//need combine them together
				var filters = this._aLibFilter.slice();
				filters.push(this._oNameFilter); 
				
				var binding = this._oComboBox.getBinding('items');
				binding.filter(filters);
				
				this.setComboBoxInitialSelectedKey();
				
				//enable the clear btn
				// this._oClearnRestrictItemBtn.setEnabled(true);
				
				this.setRestrictName(name);
			},
			
			setRestrictName: function(name) {
				if (name) {
					this._oFilterNameLabel.setVisible(true);
					this._oFilterNameValue.setText(name);
				} else {
					this._oFilterNameLabel.setVisible(false);
					this._oFilterNameValue.setText("");
				}
			},
			
			
			onClearRestrictNameButtonPressed:function() {
				// this._oClearnRestrictItemBtn.setEnabled(false);
				
				this.setRestrictName(null);
				
				if (this._oNameFilter) {
					var filters = [];
					if ( this._aLibFilter.length>0) {
						filters = this._aLibFilter; 
					} else {
						//just set an empty filter in order to reset
						var filter = new sap.ui.model.Filter('name',"Contains", "");
						filters  = [filter];
					}
					var binding = this._oComboBox.getBinding('items');
					binding.filter(filters);
				
					this._oNameFilter = null;
					
					this.setComboBoxInitialSelectedKey();
				} 
			},
			
			/**
			 * After some filer, then just set the first one as the selected item
			 */
			setComboBoxInitialSelectedKey:function(key) {
				var selKey = key;
				if (!key) {
					var items = this._oComboBox.getItems();
					selKey = items[0].getKey();
				}
				this._oComboBox.setSelectedKey(selKey);
				
				this.onComboBoxSeletedChanged();
			},
			
			
			onComboBoxSeletedChanged: function(evt) {
				this._selectedClasslabel.setText(this._oComboBox.getSelectedKey());
			},
			
			
			setCbInfo : function( func, context, data) {
				this._cbFunc    =  func;
				this._cbContext =  context;
				this._cbData    =  data;
			},
			
			/**
			 * As one dialog will used often, so can reuse it by reset to initial state
			 */
			doReset: function(cbFunc, cbContext, cbData) {
				this._canceled = false;
				this.setCbInfo(cbFunc, cbContext, cbData);
				
				var inputType = this.getInputType();
				
				switch (inputType) {
					case fd.InputType.ViewControllerFromFile: //fall down
						//just set the textfiled to null
						this._aTextFields.forEach( function(tf) {
							//tf.setValue("C:\\temp\\html");
						});
						
						break;
					case fd.InputType.ViewController: //fall down
					case fd.InputType.ViewContent:	
					case fd.InputType.Fragment:
						//just set the textfiled to null
						this._aTextFields.forEach( function(tf) {
							tf.setValue("");
						});
						break;
						
					case fd.InputType.AllControl:
						this._aTextFields.forEach( function(tf) {
							tf.setValue("");
						});
						
						//if last time set filter by name then need clear it first
						this.onClearRestrictNameButtonPressed();
						
						break;
					default:
						break;
				}
			},
			
			doInit : function(cbFunc, cbContext, cbData) {
				this.setCbInfo(cbFunc, cbContext, cbData);
				
				this.setModal(true);
				
				var inputType = this.getInputType();
				
				var data = this._mInputInfo[inputType];
				this.setTitle(data.title);

				var content=null;
				switch (inputType) {
					case fd.InputType.ViewController:
						content = this.createContentForViewControlName(data);
						break;
					case fd.InputType.Fragment:
						//now use same logic as the ViewController
						content = this.createContentForViewControlName(data);
						break;	
					case fd.InputType.ViewContent:
						content = this.createContentForViewContent(data);
						break;
					//only data diff, use same logic as vc
					case fd.InputType.ViewControllerFromFile:
						content = this.createContentForViewControlName(data);
						break;
					case fd.InputType.AllControl:
						content = this.createContentForAllcontrol(data);
						break;
					default:
						break;
				}
				
				this.addContent(content);
				
				// then add two button, this is same
				var btnOk = new sap.ui.commons.Button({
							text : "Ok",
							press: [ this.onOkPressed, this]
						});
				var btnCancel = new sap.ui.commons.Button({
							text : "Cancel",
							press : [this.onCancelPressed, this]
						});

				var btnClear = new sap.ui.commons.Button({
					text : "Clear",
					press : [this.onClearPressed, this]
				});
				
				this.addButton(btnOk);
				this.addButton(btnCancel);
				this.addButton(btnClear);
			},
			
			doOpen: function() {
				//also set the initial focus
				if (this._aTextFields != null &&  this._aTextFields.length >0) {
					this._aTextFields[0].focus();
				} else if (this._oComboBox ) {
					this._oComboBox.focus();
				}
				
				this.open();
			},

			onClearPressed: function() {
				this._aTextFields.forEach( function(tf) {
					tf.setValue("");
				});
			},
			
			onCancelPressed: function() {
				this._canceled = true;
				this.close();
				
				fd.bus.publish('input', this.getInputType(), null);
			},
			
			onOkPressed: function() {
				var tf;
				var inputType = this.getInputType();
				
				var ctrlInfo = this._mInputInfo[inputType];
				var checkOk = false;
				
				//normally just check whether the required value has set, if ok then return and trigger event, otherwise let user retry
				switch ( inputType) {
					case fd.InputType.ViewController:        //fall down
					case fd.InputType.ViewControllerFromFile: //fall down
					case fd.InputType.Fragment:
					case fd.InputType.ViewContent:	
					{
							for (var i = 0; i < this._aTextFields.length; i++) {
								if ( ctrlInfo.mandatory[i]) {
								
									tf = this._aTextFields[i];
									if ( tf.getValue().trim() == "" ) {
										var infor = ctrlInfo.labels[i].sapStartWith("*") ? ctrlInfo.labels[i].substr(1) : ctrlInfo.labels[i];
										fd.uilib.Message.warning("Please input information for " + infor ); 
										tf.focus();
										
										break;
									}
								}
							}
							
							if ( i == this._aTextFields.length)
								checkOk = true;
						}
						break;

					case fd.InputType.AllControl:
						{
							var name = this._oComboBox.getSelectedKey(); 
							if (  name == "") {
								//then check whether have value
								tf = this._aTextFields[0];
								if ( tf.getValue().trim() == "" ) {
									fd.uilib.Message.warning("Please input control name manually or select one Control from list!");
									this._oComboBox.focus();
								}
							} else {
								checkOk = true;
							} 
						}
						break;
					default:
						break;
				}
				
				if (checkOk) {
					this.close();
					var result = this.getResult();
					
					//then call back
					this._cbFunc.call( this._cbContext, result, this._cbData);
				}
				
			},

			/**
			 * If there are more than one reuslt, then is an array
			 */
			getResult : function() {
				
				//if is close by cancel, then just return null
				if (this._canceled)
					return null;
				
				var arr = [];
				var i, tf;
				switch ( this.getInputType()) {
				
					case fd.InputType.ViewController:  //fall down
					case fd.InputType.Fragment:      //fall down
					case fd.InputType.ViewControllerFromFile:	
						for (i = 0; i < this._aTextFields.length; i++) {
							tf = this._aTextFields[i];
							arr.push(tf.getValue().trim());
						}
						//!!here direct return
						return arr; 
					case fd.InputType.ViewContent:
						var viewType = ( this._viewFmtChoice.getSelectedIndex() ==0) ? fd.ViewType.Xml :  fd.ViewType.Html;
						arr.push( viewType);
						
						for (i = 0; i < this._aTextFields.length; i++) {
							tf = this._aTextFields[i];
							arr.push(tf.getValue().trim());
						}
						return arr;
						
					case fd.InputType.AllControl:
						//!!here direct return					
						var value = this._aTextFields[0].getValue().trim();
						if ( value != "" ) {
							arr.push(value);
						}  else {
							arr.push( this._oComboBox.getSelectedKey());	
						}
					
						arr.push( this._oInsertDftCheckbox.getChecked());
						return arr;
					default:
						return null;
				}
				return null;
			},

			//call back info
			_cbFunc: null,
			_cbContext: null,
			_cbData:  null,
			
			_aTextFields : [],
			
			_oInsertDftCheckbox: null,
			_oComboBox: null,

			//The data for comobobox choice	
			_aChoiceData: [],

			//for the view format choice
			_viewFmtChoice: null,
			
			_model:  null,
			//some information for the input 
			_mInputInfo : {
				//fd.InputType.ViewController
				"vc" : {
					title : "Input name for View and Controller",
					labels : ["* View Name", "Controller Name"],
					mandatory: [ true, false],
					idxDelta: 1,
				},

				"Fragment" : {
					title : "Input name for Fragment",
					labels : ["* Fragment Name"],
					mandatory: [ true],
					idxDelta: 0,
				},
				
				"vcFromFile" : {
					title : "Input full file name for View and Controller.  Only works when run it on local file system!",
					labels : ["XML/HTML View full file name, such as c:\\main.view.xml (*)", "Controller full file name, such as c:\\main.controller.js"],
					mandatory: [ true, false],
					idxDelta: 0,
				},
				
				'ViewContent': {
					title : "Input xml/html view file string content",
					labels : ["* View type", "* View Name", "View String Content (*)"],
					rows:    [0,                  1,              15],
					idxDelta: 1,
					mandatory: [ true, true],
				},
					
					
				'AllControl': {
					title: "Select one Control",
				},
				
				'Aggregation' : {
					title: "Select one Control for the Aggregation"
				},
			},
			
			_canceled: false,
			
			_selectedClasslabel: null,
			_oFilterNameLabel : null,
         	_oFilterNameValue :null,
			
			//the lib filter, even user not select it then it still have valid value 
			_aLibFilter : [],
			
			//after user select filter by name, then set it, so after click the ok it can reset the filters 
			_oNameFilter: null,
			_oClearnRestrictItemBtn:null,
		});

