sap.ui.controller("MTable_Columns", {
    // ========OnInit part, add local demo data by guess, please adjust by yourself ============
    // ====For some binding if not start by /, please don't forget add the bindContext() ===

onInit : function () {

var demoData = 
{
	"ProductCollection": [
		{
			"ProductId": "1239102",
			"Name": "Power Projector 4713",
			"Category": "Projector",
			"SupplierName": "Titanium",
			"Description": "A very powerful projector with special features for Internet usability, USB",
			"WeightMeasure": 1467,
			"WeightUnit": "g",
			"Price": 856.49,
			"CurrencyCode": "EUR",
			"Status": "Available",
			"Quantity": 3,
			"UoM": "PC",
			"Width": 51,
			"Depth": 42,
			"Height": 18,
			"DimUnit": "cm",
		},
		{
			"ProductId": "2212-121-828",
			"Name": "Gladiator MX",
			"Category": "Graphics Card",
			"SupplierName": "Technocom",
			"Description": "Gladiator MX: DDR2 RoHS 128MB Supporting 512MB Clock rate: 350 MHz Memory Clock: 533 MHz, Bus Type: PCI-Express, Memory Type: DDR2 Memory Bus: 32-bit Highlighted Features: DVI Out, TV Out , HDTV",
			"WeightMeasure": 321,
			"WeightUnit": "g",
			"Price": 81.7,
			"CurrencyCode": "EUR",
			"Status": "Discontinued",
			"Quantity": 10,
			"UoM": "PC",
			"Width": 34,
			"Depth": 14,
			"Height": 2,
			"DimUnit": "cm",
		},
		{
			"ProductId": "K47322.1",
			"Name": "Hurricane GX",
			"Category": "Graphics Card",
			"SupplierName": "Red Point Stores",
			"Description": "Hurricane GX: DDR2 RoHS 512MB Supporting 1024MB Clock rate: 550 MHz Memory Clock: 933 MHz, Bus Type: PCI-Express, Memory Type: DDR2 Memory Bus: 64-bit Highlighted Features: DVI Out, TV-In, TV-Out, HDTV",
			"WeightMeasure": 588,
			"WeightUnit": "g",
			"Price": 219,
			"CurrencyCode": "EUR",
			"Status": "Out of Stock",
			"Quantity": 25,
			"UoM": "PC",
			"Width": 34,
			"Depth": 14,
			"Height": 2,
			"DimUnit": "cm",
		},
		{
			"ProductId": "22134T",
			"Name": "Webcam",
			"Category": "Accessory",
			"SupplierName": "Technocom",
			"Description": "Web camera, color, High-Speed USB",
			"WeightMeasure": 700,
			"WeightUnit": "g",
			"Price": 59,
			"CurrencyCode": "EUR",
			"Status": "Available",
			"Quantity": 22,
			"UoM": "PC",
			"Width": 18,
			"Depth": 19,
			"Height": 21,
			"DimUnit": "cm",
		},
		{
			"ProductId": "P1239823",
			"Name": "Monitor Locking Cable",
			"Category": "Accessory",
			"SupplierName": "Technocom",
			"Description": "Lock for Monitor",
			"WeightMeasure": 40,
			"WeightUnit": "g",
			"Price": 13.49,
			"CurrencyCode": "EUR",
			"Status": "Available",
			"Quantity": 30,
			"UoM": "PC",
			"Width": 11,
			"Depth": 11,
			"Height": 3,
			"DimUnit": "cm",
		},
		{
			"ProductId": "214-121-828",
			"Name": "Laptop Case",
			"Category": "Accessory",
			"SupplierName": "Red Point Stores",
			"Description": "Laptop Case with room for pencils and other items",
			"WeightMeasure": 1289,
			"WeightUnit": "g",
			"Price": 78.99,
			"CurrencyCode": "EUR",
			"Status": "Discontinued",
			"Quantity": 15,
			"UoM": "PC",
			"Width": 53,
			"Depth": 34,
			"Height": 7,
			"DimUnit": "cm",
		},
		{
			"ProductId": "XKP-312548",
			"Name": "USB Stick 16 GByte",
			"Category": "Accessory",
			"SupplierName": "Red Point Stores",
			"Description": "USB 2.0 HighSpeed 16GB",
			"WeightMeasure": 11,
			"WeightUnit": "g",
			"Price": 17.19,
			"CurrencyCode": "EUR",
			"Status": "Out of Stock",
			"Quantity": 45,
			"UoM": "PC",
			"Width": 6,
			"Depth": 2,
			"Height": 0.5,
			"DimUnit": "cm",
		},
		{
			"ProductId": "KTZ-12012.V2",
			"Name": "Deskjet Super Highspeed",
			"Category": "Printer",
			"SupplierName": "Red Point Stores",
			"Description": "1200 dpi x 1200 dpi - up to 25 ppm (mono) / up to 24 ppm (colour) - capacity: 100 sheets - Hi-Speed USB2.0, Ethernet",
			"WeightMeasure": 100,
			"WeightUnit": "g",
			"Price": 117.19,
			"CurrencyCode": "EUR",
			"Status": "Available",
			"Quantity": 10,
			"UoM": "PC",
			"Width": 87,
			"Depth": 45,
			"Height": 39,
			"DimUnit": "cm",
		},
		{
			"ProductId": "89932-922",
			"Name": "Laser Allround Pro",
			"Category": "Printer",
			"SupplierName": "Red Point Stores",
			"Description": "Print up to 25 ppm letter and 24 ppm A4 color or monochrome, with a first-page-out-time of less than 13 seconds for monochrome and less than 15 seconds for color",
			"WeightMeasure": 2134,
			"WeightUnit": "g",
			"Price": 39.99,
			"CurrencyCode": "EUR",
			"Status": "Available",
			"Quantity": 12,
			"UoM": "PC",
			"Width": 42,
			"Depth": 29,
			"Height": 31,
			"DimUnit": "cm",

		},
		{
			"ProductId": "38094020.1",
			"Name": "Flat S",
			"Category": "Monitor",
			"SupplierName": "Very Best Screens",
			"Description": "19 inches Optimum Resolution 1600 x 1200 @ 85Hz, Max resolution 1984 x 1488 @ 75Hz, Dot Pitch: 0.24mm",
			"WeightMeasure": 1401,
			"WeightUnit": "g",
			"Price": 339,
			"CurrencyCode": "EUR",
			"Status": "Out of Stock",
			"Quantity": 12,
			"UoM": "PC",
			"Width": 88,
			"Depth": 13,
			"Height": 49,
			"DimUnit": "cm",
			"ProductPicUrl": "test-resources/sap/ui/demokit/explored/img/HT-1030.jpg"
		},
		{
			"ProductId": "870394932",
			"Name": "Flat Medium",
			"Category": "Monitor",
			"SupplierName": "Very Best Screens",
			"Description": "21 inches Optimum Resolution 1984 x 1488 @ 85Hz, Max resolution 1720 x 1280 @ 75Hz, Dot Pitch: 0.24mm",
			"WeightMeasure": 1800,
			"WeightUnit": "g",
			"Price": 639,
			"CurrencyCode": "EUR",
			"Status": "Out of Stock",
			"Quantity": 16,
			"UoM": "PC",
			"Width": 102,
			"Depth": 13,
			"Height": 54,
			"DimUnit": "cm",
			"ProductPicUrl": "test-resources/sap/ui/demokit/explored/img/HT-1032.jpg"
		},
		{
			"ProductId": "282948303-02",
			"Name": "Flat X-large II",
			"Category": "Monitor",
			"SupplierName": "Very Best Screens",
			"Description": "23 inches Optimum Resolution 2048 × 1536 @ 85Hz, Max resolution 2080 × 1560 @ 75Hz, Dot Pitch: 0.24mm",
			"WeightMeasure": 2100,
			"WeightUnit": "g",
			"Price": 1239,
			"CurrencyCode": "EUR",
			"Status": "Available",
			"Quantity": 5,
			"UoM": "PC",
			"Width": 112,
			"Depth": 13,
			"Height": 60,
			"DimUnit": "cm",
			"ProductPicUrl": "test-resources/sap/ui/demokit/explored/img/HT-1138.jpg"
		},
		{
			"ProductId": "OP-38800002",
			"Name": "High End Laptop 2b",
			"Category": "Laptop",
			"SupplierName": "Titanium",
			"Description": "Notebook Professional 17 with 2,3GHz - 17 inches XGA - 2048MB DDR2 SDRAM - 40GB Hard Disc - DVD-Writer (DVD-R/+R/-RW/-RAM)",
			"WeightMeasure": 1190,
			"WeightUnit": "g",
			"Price": 939,
			"CurrencyCode": "EUR",
			"Status": "Out of Stock",
			"Quantity": 18,
			"UoM": "PC",
			"Width": 64,
			"Depth": 34,
			"Height": 4,
			"DimUnit": "cm",
			"ProductPicUrl": "test-resources/sap/ui/demokit/explored/img/HT-1010.jpg"
		},
		{
			"ProductId": "977700-11",
			"Name": "Hardcore Hacker",
			"Category": "Keyboard",
			"SupplierName": "Titanium",
			"Description": "Corded Keyboard with special keys for media control, USB",
			"WeightMeasure": 651,
			"WeightUnit": "g",
			"Price": 89,
			"CurrencyCode": "EUR",
			"Status": "Available",
			"Quantity": 20,
			"UoM": "PC",
			"Width": 53,
			"Depth": 24,
			"Height": 6,
			"DimUnit": "cm",
			"ProductPicUrl": "test-resources/sap/ui/demokit/explored/img/HT-1063.jpg"
		}
    ]
    };
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData( demoData );
        this.getView().setModel( oModel ) ;
    },

    // ========formatter part ============
   weightState :  function (fValue) {
    try {
      fValue = parseFloat(fValue);
      if (fValue < 0) {
        return "None";
      } else if (fValue < 1000) {
        return "Success";
      } else if (fValue < 2000) {
        return "Warning";
      } else {
        return "Error";
      }
    } catch (err) {
      return "None";
    }
 }


});