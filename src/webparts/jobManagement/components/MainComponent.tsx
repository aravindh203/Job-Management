import * as React from 'react';
import {sp} from "@pnp/sp/presets/all";
import { useState,useEffect } from 'react';
import ProviderForm from './Provider/providerFrom';
import ProviderEditForm from './Provider/ProviderEditForm';
import { Pivot, PivotItem, Spinner, SpinnerSize } from '@fluentui/react';
import ClientForm from './Client/ClientForm';
import ClientEditForm from './Client/ClientEditForm';
import ContructorForm from './Contructor/ContructorForm';
import ContructorEditForm from './Contructor/ContructorEditForm';
import ErrorComponent from './ErrorComponent';
import Services from './Services/Services';
import ServiceEditForm from './Services/ServiceEditForm';
import ProviderDashBoard from './Provider/ProviderDashBoard';
import ClientDashBoard from './Client/ClientDashBoard';
import ContructorDashBoard from './Contructor/ContructorDashBoard';
import ServiceDashBoard from './Services/ServiceDashBoard';
import ServiceChildDashBoard from './Services/ServiceChildDashBoard';
import ServiceChildEditForm from './Services/ServiceChildEditForm';
interface IComponentChange{
    providerDashBoard:boolean;
    provider:boolean;
    ProviderEdit:boolean;
    clientDashBoard:boolean;
    client:boolean;
    clientEdit:boolean;
    contructorDashBoard:boolean;
    contructor:boolean;
    conturctorEdit:boolean;
    servicesDashBoard:boolean;
    serviceChildDashBoard:boolean;
    services:boolean;
    servicesEdit:boolean;
    serviceChildEdit:boolean;
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
    const [error,setError]=useState('')
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
        providerDashBoard:false,
        provider:false,
        ProviderEdit:false,
        clientDashBoard:false,
        client:false,
        clientEdit:false,
        contructorDashBoard:false,
        contructor:false,
        conturctorEdit:false,
        servicesDashBoard:false,
        serviceChildDashBoard:false,
        services:false,
        servicesEdit:false,
        serviceChildEdit:false,
        isError:false,
        isSpinner:false,
    })
    

    const handleError = (type:string,error:any):void =>{
        console.log(type,error)
        setComponentChange({
            providerDashBoard:false,
            provider:false,
            ProviderEdit:false,
            clientDashBoard:false,
            client:false,
            clientEdit:false,
            contructorDashBoard:false,
            contructor:false,
            conturctorEdit:false,
            servicesDashBoard:false,
            serviceChildDashBoard:false,
            services:false,
            servicesEdit:false,
            serviceChildEdit:false,
            isError:true,
            isSpinner:false,
        })
        setError(type)
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

        if(pageRender === 'Provider'){
            setList({listName:'ProviderList',libraryName:'ProviderAttachment'})
            setComponentChange({
                providerDashBoard:true,
                provider:false,
                ProviderEdit:false,
                clientDashBoard:false,
                client:false,
                clientEdit:false,
                contructorDashBoard:false,
                contructor:false,
                conturctorEdit:false,
                servicesDashBoard:false,
                serviceChildDashBoard:false,
                services:false,
                servicesEdit:false,
                serviceChildEdit:false,
                isError:false,
                isSpinner:false,
            })        }
        else if(pageRender === 'Client'){
            setList({listName:'Client',libraryName:'ClientAttachment'})
            setComponentChange({
                providerDashBoard:false,
                provider:false,
                ProviderEdit:false,
                clientDashBoard:true,
                client:false,
                clientEdit:false,
                contructorDashBoard:false,
                contructor:false,
                conturctorEdit:false,
                servicesDashBoard:false,
                serviceChildDashBoard:false,
                services:false,
                servicesEdit:false,
                serviceChildEdit:false,
                isError:false,
                isSpinner:false,
            })        }
        else if(pageRender === 'Contructor'){
            setList({listName:'Contructor',libraryName:'ContructorAttachment'})
            setComponentChange({
                providerDashBoard:false,
                provider:false,
                ProviderEdit:false,
                clientDashBoard:false,
                client:false,
                clientEdit:false,
                contructorDashBoard:true,
                contructor:false,
                conturctorEdit:false,
                servicesDashBoard:false,
                serviceChildDashBoard:false,
                services:false,
                servicesEdit:false,
                serviceChildEdit:false,
                isError:false,
                isSpinner:false,
            })        }
        else if(pageRender === 'Services'){
            setList({listName:'Services',libraryName:'ServiceAttachment'})
            setComponentChange({
                providerDashBoard:false,
                provider:false,
                ProviderEdit:false,
                clientDashBoard:false,
                client:false,
                clientEdit:false,
                contructorDashBoard:false,
                contructor:false,
                conturctorEdit:false,
                servicesDashBoard:true,
                serviceChildDashBoard:false,
                services:false,
                servicesEdit:false,
                serviceChildEdit:false,
                isError:false,
                isSpinner:false,
            })
        }
    },[pageRender])
   
    return(
        <>
            <div>
                <Pivot selectedKey={props.pageRender}>
                    <PivotItem headerText="Provider" itemKey={'Provider'}
                        onRenderItemLink={(item)=>{
                            return <div onClick={()=>{
                                setPageRender(item.headerText)
                            }}>Provider</div>
                        }}/>
                    <PivotItem headerText="Client" itemKey={'Client'} onRenderItemLink={(item)=>{
                            return <div onClick={()=>{
                                setPageRender(item.headerText)
                            }}>Client</div>
                        }}/> 
                    <PivotItem headerText="Contructor" itemKey={'Contructor'} onRenderItemLink={(item)=>{
                            return <div onClick={()=>{
                                setPageRender(item.headerText)
                            }}>Contructor</div>
                        }}/>
                    <PivotItem headerText="Services" itemKey={'Services'} onRenderItemLink={(item)=>{
                            return <div onClick={()=>{
                                setPageRender(item.headerText)
                            }}>Services</div>
                        }}/>
                </Pivot>
            </div>
            {/* { dbAuthentication &&  <DashBoardComponent list={list} pageRender={pageRender} setPageRender={setPageRender} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView}  seterror={setError}/> }   */}
            
            { componentChange.providerDashBoard &&  <ProviderDashBoard list={list} pageRender={pageRender} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView}  seterror={setError}/> }  

            { componentChange.clientDashBoard &&  <ClientDashBoard list={list} pageRender={pageRender} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView}  seterror={setError}/> }  

            { componentChange.contructorDashBoard &&  <ContructorDashBoard list={list} pageRender={pageRender} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView}  seterror={setError}/> }  

            { componentChange.servicesDashBoard &&  <ServiceDashBoard list={list} pageRender={pageRender} setPageRender={setPageRender} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView}  seterror={setError}/> }  

            { componentChange.serviceChildDashBoard &&  <ServiceChildDashBoard list={list} pageRender={pageRender} setPageRender={setPageRender} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} setFormView={setFormView} formView={formView} seterror={setError}/> }  

            { componentChange.provider && <ProviderForm list={list} change={componentChange} admin={admin} manager={manager} visitors={Visitors} setChange={setComponentChange} formView={formView} seterror={setError}/> } 

            { componentChange.ProviderEdit && <ProviderEditForm  list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView} seterror={setError}/> }

            { componentChange.client && <ClientForm list={list} change={componentChange} admin={admin} manager={manager} visitors={Visitors} setChange={setComponentChange} formView={formView}/> } 

            { componentChange.clientEdit && <ClientEditForm list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView} seterror={setError}/> }

            { componentChange.contructor && <ContructorForm list={list} change={componentChange} admin={admin} manager={manager} visitors={Visitors} setChange={setComponentChange} formView={formView} seterror={setError}/> } 

            { componentChange.conturctorEdit && <ContructorEditForm list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView} seterror={setError}/> }

            { componentChange.services && <Services list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView} seterror={setError} /> }

            { componentChange.servicesEdit && <ServiceEditForm list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView} seterror={setError}/> }

            { componentChange.serviceChildEdit && <ServiceChildEditForm list={list} currentUser={currentUser} admin={admin} manager={manager} visitors={Visitors} change={componentChange} setChange={setComponentChange} formView={formView} setFormView={setFormView} seterror={setError}/> }

            { componentChange.isSpinner && <Spinner styles={circle}/> }

            {componentChange.isError && <ErrorComponent error={error}/>}
        </>
     )
}
export default MainCoimponent