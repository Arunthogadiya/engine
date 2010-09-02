/*
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
GENTICS.Aloha.ListPlugin=new GENTICS.Aloha.Plugin("com.gentics.aloha.plugins.List");GENTICS.Aloha.ListPlugin.languages=["en","de","fr","eo","fi","ru","it"];GENTICS.Aloha.ListPlugin.config=["ul","ol"];GENTICS.Aloha.ListPlugin.transformableElements={p:true,h1:true,h2:true,h3:true,h4:true,h5:true,h6:true,ul:true,ol:true};GENTICS.Aloha.ListPlugin.init=function(){var that=this;this.createUnorderedListButton=new GENTICS.Aloha.ui.Button({iconClass:"GENTICS_button GENTICS_button_ul",size:"small",tooltip:this.i18n("button.createulist.tooltip"),toggle:true,onclick:function(element,event){that.transformList(false)}});GENTICS.Aloha.FloatingMenu.addButton("GENTICS.Aloha.continuoustext",this.createUnorderedListButton,GENTICS.Aloha.i18n(GENTICS.Aloha,"floatingmenu.tab.format"),1);this.createOrderedListButton=new GENTICS.Aloha.ui.Button({iconClass:"GENTICS_button GENTICS_button_ol",size:"small",tooltip:this.i18n("button.createolist.tooltip"),toggle:true,onclick:function(element,event){that.transformList(true)}});GENTICS.Aloha.FloatingMenu.addButton("GENTICS.Aloha.continuoustext",this.createOrderedListButton,GENTICS.Aloha.i18n(GENTICS.Aloha,"floatingmenu.tab.format"),1);GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,"selectionChanged",function(event,rangeObject){that.createUnorderedListButton.setPressed(false);that.createOrderedListButton.setPressed(false);for(var i=0;i<rangeObject.markupEffectiveAtStart.length;i++){var effectiveMarkup=rangeObject.markupEffectiveAtStart[i];if(GENTICS.Aloha.Selection.standardTextLevelSemanticsComparator(effectiveMarkup,jQuery("<ul></ul>"))){that.createUnorderedListButton.setPressed(true);break}if(GENTICS.Aloha.Selection.standardTextLevelSemanticsComparator(effectiveMarkup,jQuery("<ol></ol>"))){that.createOrderedListButton.setPressed(true);break}}if(GENTICS.Aloha.activeEditable){that.applyButtonConfig(GENTICS.Aloha.activeEditable.obj)}GENTICS.Aloha.FloatingMenu.doLayout()});GENTICS.Aloha.Markup.addKeyHandler(9,function(event){return that.processTab(event)})};GENTICS.Aloha.ListPlugin.applyButtonConfig=function(obj){var config=this.getEditableConfig(obj);if(jQuery.inArray("ul",config)!=-1&&GENTICS.Aloha.Selection.canTag1WrapTag2(GENTICS.Aloha.Selection.rangeObject.unmodifiableMarkupAtStart[0].nodeName,"ul")!=-1){this.createUnorderedListButton.show()}else{this.createUnorderedListButton.hide()}if(jQuery.inArray("ol",config)!=-1&&GENTICS.Aloha.Selection.canTag1WrapTag2(GENTICS.Aloha.Selection.rangeObject.unmodifiableMarkupAtStart[0].nodeName,"ol")!=-1){this.createOrderedListButton.show()}else{this.createOrderedListButton.hide()}};GENTICS.Aloha.ListPlugin.processTab=function(event){switch(event.keyCode){case 9:if(event.shiftKey){return this.outdentList()}else{return this.indentList()}}return true};GENTICS.Aloha.ListPlugin.getStartingDomObjectToTransform=function(){var rangeObject=GENTICS.Aloha.Selection.rangeObject;for(var i=0;i<rangeObject.markupEffectiveAtStart.length;i++){var effectiveMarkup=rangeObject.markupEffectiveAtStart[i];if(this.transformableElements[effectiveMarkup.nodeName.toLowerCase()]){return effectiveMarkup}}return false};GENTICS.Aloha.ListPlugin.getNearestSelectedListItem=function(){var rangeObject=GENTICS.Aloha.Selection.rangeObject;for(var i=0;i<rangeObject.markupEffectiveAtStart.length;i++){var effectiveMarkup=rangeObject.markupEffectiveAtStart[i];if(GENTICS.Utils.Dom.isListElement(effectiveMarkup)){return effectiveMarkup}}return false};GENTICS.Aloha.ListPlugin.transformList=function(ordered){var domToTransform=this.getStartingDomObjectToTransform();if(!domToTransform){GENTICS.Aloha.Selection.changeMarkupOnSelection(jQuery("<p></p>"));domToTransform=this.getStartingDomObjectToTransform();if(!domToTransform){GENTICS.Aloha.Log.error(this,"Could not transform selection into a list");return}}var nodeName=domToTransform.nodeName.toLowerCase();if(nodeName=="ul"&&!ordered){var jqList=jQuery(domToTransform);var jqParentList=jqList.parent();if(jqParentList.length>0&&GENTICS.Utils.Dom.isListElement(jqParentList.get(0))){jqList.children().unwrap()}else{var jqToTransform=jQuery(domToTransform);jQuery.each(jqToTransform.children("li"),function(index,li){var newPara=GENTICS.Aloha.Markup.transformDomObject(li,"p");newPara.after(newPara.children("ol,ul"))});jqToTransform.children().unwrap()}}else{if(nodeName=="ul"&&ordered){GENTICS.Aloha.Markup.transformDomObject(domToTransform,"ol");this.mergeAdjacentLists(jQuery(domToTransform))}else{if(nodeName=="ol"&&!ordered){GENTICS.Aloha.Markup.transformDomObject(domToTransform,"ul");this.mergeAdjacentLists(jQuery(domToTransform))}else{if(nodeName=="ol"&&ordered){var jqList=jQuery(domToTransform);var jqParentList=jqList.parent();if(jqParentList.length>0&&GENTICS.Utils.Dom.isListElement(jqParentList.get(0))){jqList.children().unwrap()}else{var jqToTransform=jQuery(domToTransform);jQuery.each(jqToTransform.children("li"),function(index,li){var newPara=GENTICS.Aloha.Markup.transformDomObject(li,"p");newPara.after(newPara.children("ol,ul"))});jqToTransform.children().unwrap()}}else{var selectedSiblings=GENTICS.Aloha.Selection.rangeObject.getSelectedSiblings(domToTransform);var jqList=ordered?jQuery("<ol></ol>"):jQuery("<ul></ul>");var jqNewLi=jQuery("<li></li>");jqList.append(jqNewLi);jQuery(domToTransform).contents().appendTo(jqNewLi);jQuery(domToTransform).replaceWith(jqList);if(selectedSiblings){var lastLi=false;for(var i=0;i<selectedSiblings.length;++i){if(GENTICS.Utils.Dom.isBlockLevelElement(selectedSiblings[i])){if(lastLi){lastLi=false}jqNewLi=GENTICS.Aloha.Markup.transformDomObject(selectedSiblings[i],"li");jqList.append(jqNewLi)}else{if(selectedSiblings[i].nodeType==3&&jQuery.trim(selectedSiblings[i].data).length==0){continue}if(!lastLi){lastLi=jQuery("<li></li>");jqList.append(lastLi)}lastLi.append(selectedSiblings[i])}}}this.mergeAdjacentLists(jqList)}}}}this.refreshSelection()};GENTICS.Aloha.ListPlugin.indentList=function(){var listItem=this.getNearestSelectedListItem();if(listItem){var jqItemBefore=jQuery(listItem).prev("li");if(jqItemBefore.length==0){return false}var jqOldList=jQuery(listItem).parent();var selectedSiblings=GENTICS.Aloha.Selection.rangeObject.getSelectedSiblings(listItem);var jqNewList=jQuery(listItem).parent().clone(false).empty();jqNewList.append(listItem);jqItemBefore.append(jqNewList);if(selectedSiblings){for(var i=0;i<selectedSiblings.length;++i){jqNewList.append(jQuery(selectedSiblings[i]))}}this.mergeAdjacentLists(jqNewList);this.refreshSelection();return false}return true};GENTICS.Aloha.ListPlugin.outdentList=function(){var listItem=this.getNearestSelectedListItem();if(listItem){var jqListItem=jQuery(listItem);var jqList=jqListItem.parent();var jqParentList=jqList.parents("ul,ol");var wrappingLi=jqList.parent("li");if(jqParentList.length>0&&GENTICS.Utils.Dom.isListElement(jqParentList.get(0))){var selectedSiblings=GENTICS.Aloha.Selection.rangeObject.getSelectedSiblings(listItem);if(selectedSiblings&&selectedSiblings.length>0){var lastSelected=jQuery(selectedSiblings[selectedSiblings.length-1])}else{var lastSelected=jqListItem}if(lastSelected.nextAll("li").length>0){var jqNewPostList=jqList.clone(false).empty();jqNewPostList.append(lastSelected.nextAll())}if(wrappingLi.length>0){if(typeof jqNewPostList!=="undefined"){jqListItem.append(jqNewPostList)}wrappingLi.after(jqListItem)}else{jqList.before(jqListItem)}if(selectedSiblings&&selectedSiblings.length>0){for(var i=selectedSiblings.length-1;i>=0;--i){jqListItem.after(jQuery(selectedSiblings[i]))}}if(jqList.contents("li").length==0){jqList.remove()}if(wrappingLi.length>0&&wrappingLi.contents().length==0){wrappingLi.remove()}this.refreshSelection()}return false}return true};GENTICS.Aloha.ListPlugin.refreshSelection=function(){if(GENTICS.Aloha.activeEditable){GENTICS.Aloha.activeEditable.obj[0].focus()}GENTICS.Aloha.Selection.rangeObject.update();GENTICS.Aloha.Selection.rangeObject.select();GENTICS.Aloha.Selection.updateSelection()};GENTICS.Aloha.ListPlugin.mergeAdjacentLists=function(jqList){var firstList=jqList.get(0);while(firstList.previousSibling&&firstList.previousSibling.nodeType==1&&firstList.previousSibling.nodeName==firstList.nodeName){firstList=firstList.previousSibling}jqList=jQuery(firstList);while(firstList.nextSibling&&((firstList.nextSibling.nodeType==1&&firstList.nextSibling.nodeName==firstList.nodeName)||(firstList.nextSibling.nodeType==3&&jQuery.trim(firstList.nextSibling.data).length==0))){var jqNextList=jQuery(firstList.nextSibling);if(firstList.nextSibling.nodeType==1){jqNextList.contents().appendTo(jqList)}jqNextList.remove()}};