import * as React from 'react';
import { useState,useEffect } from 'react';
import DashBoardComponent from './DashBoardComponent';
import ProviderForm from './Provider/providerFrom';
import ProviderEditForm from './Provider/ProviderEditForm';
const MainCoimponent=(props:any)=>{

    const [dbAuthentication,setDbAuthentication] = useState<boolean>(true)
    const [componentChange,setComponentChange]=React.useState({
        provider:false,
        ProviderEdit:false,
        clinet:false,
        contructor:false
    })

    console.log('componentChange',componentChange);
        
    const [formView,setFormView]=React.useState({
        authentication:false,
        Id:null,
        status:''
    })
   
    useEffect(()=>{
        var dashboard = [];
        for(let key in componentChange){
            dashboard.push(componentChange[key])
        } 

        var dbauthendic = dashboard.every(value=>value===false);
        setDbAuthentication(dbauthendic)
        
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