import * as React from 'react';
import {sp} from "@pnp/sp/presets/all";
import { useState,useEffect } from 'react';
import DashBoardComponent from './DashBoardComponent';
import ProviderForm from './Provider/providerFrom';
import ProviderEditForm from './Provider/ProviderEditForm';
import { Spinner, SpinnerSize } from '@fluentui/react';
import ClientForm from './Client/ClientForm';
import ClientEditForm from './Client/ClientEditForm';
import ContructorForm from './Contructor/ContructorForm';
import ContructorEditForm from './Contructor/ContructorEditForm';
import ErrorComponent from './ErrorComponent';
import Services from './Services/Services';
import ServiceEditForm from './Services/ServiceEditForm';
interface IComponentChange{
    provider:boolean;
    ProviderEdit:boolean;
    client:boolean;
    clientEdit:boolean;
    contructor:boolean;
    conturctorEdit:boolean;
    services:boolean;
    servicesEdit:boolean;
    isError:boolean;
    isSpinner:boolean;
}

interface IFormView{
    authentication:boolean;
    Id:number;
    status:string;
}

const MainCoimponent=(props:any)=>{
    
    const currentUser= props.context._pageContext._user.email;
    const circle={
        root:{
            ".ms-Spinner-circle":{
                width:"50px",
                height:"50px",
                borderWidth:"5px"
            }
        }
    }


    const [pageRender,setPageRender] = useState<string>('Provider')       
    const [admin,setAdmin ] =useState<boolean>(false);
    const [manager,setManager]=useState<boolean>(false)
    const [Visitors,setVisitor]=useState<boolean>(false)    
    const [dbAuthentication,setDbAuthentication] = useState<boolean>(true)
    const [list,setList] = useState({
        listName:'ProviderList',
        libraryName:'ProviderAttachment'
    }) 
    const [formView,setFormView]=React.useState<IFormView>({
        authentication:false,
        Id:null,
        status:''
    })
    const [componentChange,setComponentChange]=React.useState<IComponentChange>({
        provider:false,
        ProviderEdit:false,
        client:false,
        clientEdit:false,
        contructor:false,
        conturctorEdit:false,
        services:false,
        servicesEdit:false,
        isError:false,
        isSpinner:false,
    })
    

    const handleError = (type:string,error:any):void =>{
        console.log(type,error)
        setComponentChange({
            provider:false,
            ProviderEdit:false,
            client:false,
            clientEdit:false,
            contructor:false,
            conturctorEdit:false,
            services:false,
            servicesEdit:false,
            isError:true,
            isSpinner:false
        })
    }
  
    const getVisitors= async () =>{

        await sp.web.siteGroups.getByName('Visitors').users.get()
        .then(data=>{
            let isVisitorAuthentication = data.some(value=>value.Email===currentUser);

            setVisitor(isVisitorAuthentication)
        })
        .catch(error=>{
            handleError('get group Admin',error)    
        })

    }

    const getManagers = async () =>{

        await sp.web.siteGroups.getByName('Manager').users.get()
        .then(data=>{
            let ismanagerAuthentication = data.some(value=>value.Email===currentUser);

            setManager(ismanagerAuthentication)
            getVisitors()
        })
        .catch(error=>{
            handleError('get group manager',error)
        })

    }

    const getAdmin = async () =>{

        await sp.web.siteGroups.getByName('Admin').users.get()
        .then(data=>{
            let isAdminAuthentication = data.some(value=>value.Email===currentUser)

            setAdmin(isAdminAuthentication)
            getManagers()
        })
        .catch(error=>{
            handleError('get group Admin',error)
        })

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

    useEffect(()=>{

        if(pageRender === 'Provider'){
            setList({listName:'ProviderList',libraryName:'ProviderAttachment'})
        }
        else if(pageRender === 'Client'){
            setList({listName:'Client',libraryName:'ClientAttachment'})
        }
        else if(pageRender === 'Contructor'){
            setList({listName:'Contructor',libraryName:'ContructorAttachment'})
        }
        else if(pageRender === 'Services'){
            setList({listName:'Services',libraryName:'ServiceAttachment'})
        }
        
    },[pageRender])

    return(
        <>
            { dbAuthentication &&  <DashBoardComponent list={list} pageRender={pageRender} setPageRender={setPageRender} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView}/> }  

            { componentChange.provider && <ProviderForm list={list} change={componentChange} admin={admin} manager={manager} visitors={Visitors} setChange={setComponentChange} formView={formView}/> } 

            { componentChange.ProviderEdit && <ProviderEditForm  list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView}/> }

            { componentChange.client && <ClientForm list={list} change={componentChange} admin={admin} manager={manager} visitors={Visitors} setChange={setComponentChange} formView={formView}/> } 

            { componentChange.clientEdit && <ClientEditForm list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView}/> }

            { componentChange.contructor && <ContructorForm list={list} change={componentChange} admin={admin} manager={manager} visitors={Visitors} setChange={setComponentChange} formView={formView}/> } 

            { componentChange.conturctorEdit && <ContructorEditForm list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView}/> }

            { componentChange.services && <Services list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView}/> }

            { componentChange.servicesEdit && <ServiceEditForm list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView}/> }

            { componentChange.isSpinner && <Spinner styles={circle}/> }

            {componentChange.isError && <ErrorComponent />}
        </>
     )
}
export default MainCoimponent