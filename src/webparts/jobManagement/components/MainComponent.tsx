import * as React from 'react';
import { useState,useEffect } from 'react';
import DashBoardComponent from './DashBoardComponent';
import ProviderForm from './Provider/providerFrom';
import ProviderEditForm from './Provider/ProviderEditForm';
interface IComponentChange{
    provider:boolean;
    ProviderEdit:boolean;
    clinet:boolean;
    contructor:boolean;
}
interface IFormView{
    authentication:boolean;
    Id:number;
    status:string;
}
const MainCoimponent=(props:any)=>{

    const [dbAuthentication,setDbAuthentication] = useState<boolean>(true)
    const [componentChange,setComponentChange]=React.useState<IComponentChange>({
        provider:false,
        ProviderEdit:false,
        clinet:false,
        contructor:false
    })
    const [formView,setFormView]=React.useState<IFormView>({
        authentication:false,
        Id:null,
        status:''
    })
   
    useEffect(()=>{
        var dashboard = [];
        for(let key in componentChange){
            dashboard.push(componentChange[key])
        } 

        var dbauthentic = dashboard.every(value=>value===false);
        setDbAuthentication(dbauthentic)
        
    },[componentChange])
    return(
        <>
            {
                dbAuthentication ?  <DashBoardComponent change={componentChange} setChange={setComponentChange} setFormView={setFormView}/>:null
            }  
            {
                componentChange.provider ? <ProviderForm change={componentChange} setChange={setComponentChange}/>:null
            }      
            {
                componentChange.ProviderEdit ? <ProviderEditForm change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView}/>:null
            }
        </>
     )
}
export default MainCoimponent