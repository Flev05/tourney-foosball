import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'setup', loadChildren: './components/setup/setup.module#SetupModule'},
            {path: 'autocomplete', loadChildren: './components/autocomplete/autocompletedemo.module#AutoCompleteDemoModule'},
            {path: 'blockui', loadChildren: './components/blockui/blockuidemo.module#BlockUIDemoModule'},
            {path: 'breadcrumb', loadChildren: './components/breadcrumb/breadcrumbdemo.module#BreadcrumbDemoModule'},
            {path: 'button', loadChildren: './components/button/buttondemo.module#ButtonDemoModule'},
            {path: 'calendar', loadChildren: './components/calendar/calendardemo.module#CalendarDemoModule'},
            {path: 'captcha', loadChildren: './components/captcha/captchademo.module#CaptchaDemoModule'},
            {path: 'card', loadChildren: './components/card/carddemo.module#CardDemoModule'},
            {path: 'carousel', loadChildren: './components/carousel/carouseldemo.module#CarouselDemoModule'},
            {path: 'chart', loadChildren: './components/chart/chartdemo.module#ChartDemoModule'},
            {path: 'checkbox', loadChildren: './components/checkbox/checkboxdemo.module#CheckboxDemoModule'},
            {path: 'chips', loadChildren: './components/chips/chipsdemo.module#ChipsDemoModule'},
            {path: 'codehighlighter', loadChildren: './components/codehighlighter/codehighlighterdemo.module#CodeHighlighterDemoModule'},
            {path: 'colorpicker', loadChildren: './components/colorpicker/colorpickerdemo.module#ColorPickerDemoModule'},
            {path: 'confirmdialog', loadChildren: './components/confirmdialog/confirmdialogdemo.module#ConfirmDialogDemoModule'},
            {path: 'contextmenu', loadChildren: './components/contextmenu/contextmenudemo.module#ContextMenuDemoModule'},
            {path: 'datagrid', loadChildren: './components/datagrid/datagriddemo.module#DataGridDemoModule'},
            {path: 'datalist', loadChildren: './components/datalist/datalistdemo.module#DataListDemoModule'},
            {path: 'datascroller', loadChildren: './components/datascroller/datascrollerdemo.module#DataScrollerDemoModule'},
            {path: 'datatable', loadChildren: './components/datatable/datatabledemo.module#DataTableDemoModule'},
            {path: 'dataview', loadChildren: './components/dataview/dataviewdemo.module#DataViewDemoModule'},
            {path: 'defer', loadChildren: './components/defer/deferdemo.module#DeferDemoModule'},
            {path: 'dialog', loadChildren: './components/dialog/dialogdemo.module#DialogDemoModule'},
            {path: 'dragdrop', loadChildren: './components/dragdrop/dragdropdemo.module#DragDropDemoModule'},
            {path: 'dropdown', loadChildren: './components/dropdown/dropdowndemo.module#DropdownDemoModule'},
            {path: 'editor', loadChildren: './components/editor/editordemo.module#EditorDemoModule'},
            {path: 'fieldset', loadChildren: './components/fieldset/fieldsetdemo.module#FieldsetDemoModule'},
            {path: 'fileupload', loadChildren: './components/fileupload/fileuploaddemo.module#FileUploadDemoModule'},
            {path: 'galleria', loadChildren: './components/galleria/galleriademo.module#GalleriaDemoModule'},
            {path: 'gmap', loadChildren: './components/gmap/gmapdemo.module#GMapDemoModule'},
            {path: 'grid', loadChildren: './components/grid/griddemo.module#GridDemoModule'},
            {path: 'growl', loadChildren: './components/growl/growldemo.module#GrowlDemoModule'},
            {path: 'inplace', loadChildren: './components/inplace/inplacedemo.module#InplaceDemoModule'},
            {path: 'inputmask', loadChildren: './components/inputmask/inputmaskdemo.module#InputMaskDemoModule'},
            {path: 'inputswitch', loadChildren: './components/inputswitch/inputswitchdemo.module#InputSwitchDemoModule'},
            {path: 'inputtext', loadChildren: './components/inputtext/inputtextdemo.module#InputTextDemoModule'},
            {path: 'inputgroup', loadChildren: './components/inputgroup/inputgroupdemo.module#InputGroupDemoModule'},
            {path: 'inputtextarea', loadChildren: './components/inputtextarea/inputtextareademo.module#InputTextareaDemoModule'},
            {path: 'keyfilter', loadChildren: './components/keyfilter/keyfilterdemo.module#KeyFilterDemoModule'},
            {path: 'lightbox', loadChildren: './components/lightbox/lightboxdemo.module#LightboxDemoModule'},
            {path: 'listbox', loadChildren: './components/listbox/listboxdemo.module#ListboxDemoModule'},
            {path: 'splitbutton', loadChildren: './components/splitbutton/splitbuttondemo.module#SplitButtonDemoModule'},
        ])    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
