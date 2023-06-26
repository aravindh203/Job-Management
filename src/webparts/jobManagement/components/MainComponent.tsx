import * as React from 'react';
import {sp} from "@pnp/sp/presets/all";
import { useState,useEffect } from 'react';
import DashBoardComponent from './DashBoardComponent';
import ProviderForm from './Provider/providerFrom';
import ProviderEditForm from './Provider/ProviderEditForm';
import { Spinner, SpinnerSize } from '@fluentui/react';
interface IComponentChange{
    provider:boolean;
    ProviderEdit:boolean;
    clinet:boolean;
    contructor:boolean;
    isSpinner:boolean;
}
interface IFormView{
    authentication:boolean;
    Id:number;
    status:string;
}
const MainCoimponent=(props:any)=>{
    const circle={
        root:{
            ".ms-Spinner-circle":{
                width:"100px",
                height:"100px",
                borderWidth:"5px"
            }
        }
    }
    const currentUser= props.context._pageContext._user.email;
    
    const [admin,setAdmin ] =useState<boolean>(false);
    const [manager,setManager]=useState<boolean>(false)
    const [Visitors,setVisitor]=useState<boolean>(false)    
    const [dbAuthentication,setDbAuthentication] = useState<boolean>(true)
    const [componentChange,setComponentChange]=React.useState<IComponentChange>({
        provider:false,
        ProviderEdit:false,
        clinet:false,
        contructor:false,
        isSpinner:false,
    })
    const [formView,setFormView]=React.useState<IFormView>({
        authentication:false,
        Id:null,
        status:''
    })

    const handleError = (type:string,error:any):void =>{
        console.log(type,error)
    }
   
    const getVisitors= async () =>{
        await sp.web.siteGroups.getByName('Visitors').users.get()
        .then(data=>{
            let isVisitorAuthentication = data.some(value=>value.Email===currentUser);
            setVisitor(isVisitorAuthentication)
        })
        .catch(error=>handleError('get group Admin',error))
    }


    const getManagers = async () =>{
        await sp.web.siteGroups.getByName('Manager').users.get()
        .then(data=>{
            let ismanagerAuthentication = data.some(value=>value.Email===currentUser);
            setManager(ismanagerAuthentication)
            getVisitors()
        })
        .catch(error=>handleError('get group manager',error))
    }

    const getAdmin = async () =>{
        await sp.web.siteGroups.getByName('Admin').users.get()
        .then(data=>{
            let isAdminAuthentication = data.some(value=>value.Email===currentUser)
            setAdmin(isAdminAuthentication)
            getManagers()
        })
        .catch(error=>handleError('get group Admin',error))
    }
    
    useEffect(()=>{
        getAdmin()
    },[])

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
                dbAuthentication ?  <DashBoardComponent currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView}/>:null
            }  
            {
                componentChange.provider ? <ProviderForm change={componentChange} admin={admin} manager={manager} visitors={Visitors} setChange={setComponentChange} formView={formView}/>:null
            }      
            {
                componentChange.ProviderEdit ? <ProviderEditForm  currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView}/>:null
            }
            {
                componentChange.isSpinner ? <Spinner styles={circle} />:null
            }

        </>
     )
}
export default MainCoimponent