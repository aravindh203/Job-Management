import * as React from 'react';
import { sp} from "@pnp/sp/presets/all";
import * as moment from 'moment';
import styles from './Services.module.scss'
import { DatePicker, DefaultButton, Dropdown, IDropdownOption, IconButton, TextField } from '@fluentui/react';

interface IData{
    Name:string;
    PhoneNo:string;
    Email:string;
    FirstAddress:string;
    SecondAddress:string;
    Id:number;
}
const ServiceChildEditForm=(props:any)=>{
    let approve:string='Approve'
    let viewAuthentication=props.formView.status=='view' ? true:false
   
    const services:IDropdownOption[]=[{
        key:'House Cleaning',
        text:"House Cleaning"
    },{
        key:'Plumbing',
        text:'Plumbing'
    },{
        key:'Painting',
        text:'Painting'
    },{
        key:'Bathroom Cleaning',
        text:'Bathroom Cleaning'
    },{
        key:'Vessel Washing',
        text:'Vessel Washing'
    }]
    const [providerDropDown,setProviderDropDown]=React.useState<IDropdownOption[]>([])
    const [clientrDropDown,setClientDropDown]=React.useState<IDropdownOption[]>([])
    const [contructorDropDown,setContructorDropDown]=React.useState<IDropdownOption[]>([])
    const [serviceData,setServiceData]=React.useState({
        ServiceName:'',
        ServiceDate:new Date(),
        Notes:'',
        Status:'',
        ProviderId:null,
        ClientId:null,
        ContructorId:null,
        ServiceId:null
    })    
    const [providerData,setProviderData]=React.useState<IData>({
        Name:'',
        PhoneNo:'',
        Email:'',
        FirstAddress:'',
        SecondAddress:'',
        Id:null
    })
    const [clientData,setClientData]=React.useState<IData>({
        Name:'',
        PhoneNo:'',
        Email:'',
        FirstAddress:'',
        SecondAddress:'',
        Id:null
    })
    const [contructorData,setContructorData]=React.useState<IData>({
        Name:'',
        PhoneNo:'',
        Email:'',
        FirstAddress:'',
        SecondAddress:'',
        Id:null
    })
    const [btnAuthntication,setBtnAuthendication]=React.useState({
        BookConfirm:false,
        Complete:false,
        Invoice:false,
        InvoicePaid:false,
    })

    const findStatus=()=>{
       console.log('statsus',serviceData.Status);
       
        if(serviceData.Status==='InProgress'){
            setBtnAuthendication({...btnAuthntication,BookConfirm:true})
        }else if(serviceData.Status==='BookConfirm'){
            setBtnAuthendication({...btnAuthntication,Complete:true})
        }else if(serviceData.Status==='Complete'){
            setBtnAuthendication({...btnAuthntication,Invoice:true})
        }else if(serviceData.Status==='Invoice'){
            setBtnAuthendication({...btnAuthntication,InvoicePaid:true})
        }
    }
    const getProviderDropData=async()=>{
        await sp.web.lists.getByTitle('ProviderList').items.select('id,ProviderName,Status').filter('Status eq ' + "'" + approve + "'").get().then((items)=>{
            if(items){
                let ProviderDrop=[];
                items.forEach((item)=>{
                    ProviderDrop.push({
                        key:item.Id,
                        text:item.ProviderName
                    })
                })
                setProviderDropDown(ProviderDrop)
            }
            getClientDropData()
        }).catch((error)=>errorFunction("get provider data",error))
    }

    const getClientDropData=async()=>{
        await sp.web.lists.getByTitle('Client').items.select('id,ClientName,Status').filter('Status eq ' + "'" + approve + "'").get().then((items)=>{
            if(items){
                let ClientDrop=[];
                items.forEach((item)=>{
                    ClientDrop.push({
                        key:item.Id,
                        text:item.ClientName
                    })
                })
                setClientDropDown(ClientDrop)
            }
            getContructorDropData()
        }).catch((error)=>errorFunction("get client data",error)
        )
    }

    const getContructorDropData=async()=>{
        await sp.web.lists.getByTitle('Contructor').items.select('id,ContrctName,Status').filter('Status eq ' + "'" + approve + "'").get().then((items)=>{
            if(items){
                let ContructorDrop=[]
                items.forEach((item)=>{
                    ContructorDrop.push({
                        key:item.Id,
                        text:item.ContrctName
                    })
                })
                setContructorDropDown(ContructorDrop)
            } 
        }).catch((error)=>errorFunction("get contructor data",error))
    }

    const getServicesdata=async()=>{
       
        await sp.web.lists.getByTitle('ServiceChild').items.select('ServiceName,ServiceDate,ServiceId,Notes,Status,ProviderDetailsId,ClientDetailsId,ContrctDetailsId').getById(props.formView.Id).get().then(async(result)=>{
            if(result){                
                setServiceData({
                    ServiceName:result.ServiceName ? result.ServiceName:'',
                    ServiceDate:result.ServiceDate ? new Date(result.ServiceDate):new Date(),
                    Notes:result.Notes ?result.Notes:'',
                    Status:result.Status ? result.Status:'',
                    ProviderId:result.ProviderDetailsId ? result.ProviderDetailsId:null,
                    ClientId:result.ClientDetailsId ? result.ClientDetailsId:null,
                    ContructorId:result.ContrctDetailsId ? result.ContrctDetailsId:null,
                    ServiceId:result.ServiceId ? result.ServiceId:null
                })
            }
        }).catch((error)=>errorFunction(error,'get service data'))
    }
    const getProviderData=async()=>{
        if(serviceData.ProviderId){
            await sp.web.lists.getByTitle('ProviderList').items.select('id,ProviderName,PhoneNo,ContactAdd,SecondaryAdd,Email').getById(serviceData.ProviderId).get().then((item)=>{
           
                setProviderData({
                    Name:item.ProviderName ? item.ProviderName:'',
                    PhoneNo:item.PhoneNo ? item.PhoneNo:'',
                    Email:item.Email ? item.Email:'',
                    FirstAddress:item.ContactAdd ? item.ContactAdd:'',
                    SecondAddress:item.SecondaryAdd ? item.SecondaryAdd:'',
                    Id:item.Id ? item.Id:null
                })
                getClientData()
            }).catch((error)=>errorFunction(error,'get provider data'))
        }
       
    }
    const getClientData=async()=>{
        if(serviceData.ClientId){
            await sp.web.lists.getByTitle('Client').items.select('id,ClientName,PhoneNo,ContactAddress,SecondAddress,Email').getById(serviceData.ClientId).get().then((item)=>{
                setClientData({
                    Name:item.ClientName ? item.ClientName:'',
                    PhoneNo:item.PhoneNo ? item.PhoneNo:'',
                    Email:item.Email ? item.Email:'',
                    FirstAddress:item.ContactAddress ? item.ContactAddress:'',
                    SecondAddress:item.SecondAddress ? item.SecondAddress:'',
                    Id:item.Id ? item.Id:null
                })
                getContructorData()
            }).catch((error)=>errorFunction(error,'get client data'))    
        }
    }
    const getContructorData=async()=>{
        if(serviceData.ContructorId){
            await sp.web.lists.getByTitle('Contructor').items.select('id,ContrctName,PhoneNo,ContactAddress,SecondAddress,Email,').getById(serviceData.ContructorId).get().then((item)=>{
                setContructorData({
                    Name:item.ContrctName ? item.ContrctName:'',
                    PhoneNo:item.PhoneNo ? item.PhoneNo:'',
                    Email:item.Email ? item.Email:'',
                    FirstAddress:item.ContactAddress ? item.ContactAddress:'',
                    SecondAddress:item.SecondAddress ? item.SecondAddress:'',
                    Id:item.Id ? item.Id:null
                })
            }).catch((error)=>errorFunction(error,'get contructor data')) 
        }
    }
    const handleUpdate=async(status:string)=>{
        if(props.formView.Id){
            props.setChange({...props.change,serviceChildEdit:false,isSpinner:true})
            
            let testJson = {
                ServiceName:serviceData.ServiceName ? serviceData.ServiceName:'',
                ServiceDate:serviceData.ServiceDate ? serviceData.ServiceDate:new Date(),
                Notes:serviceData.Notes ? serviceData.Notes:'',
                ProviderDetailsId:serviceData.ProviderId ? serviceData.ProviderId:null,
                ClientDetailsId:serviceData.ClientId ? serviceData.ClientId:null,
                ContrctDetailsId:serviceData.ContructorId ? serviceData.ContructorId:null,
                Status: status
            }

            await sp.web.lists.getByTitle('ServiceChild').items.getById(props.formView.Id).update(testJson).then(async(response)=>{
                props.setFormView({...props.formView,Id:serviceData.ServiceId})
                props.setChange({...props.change,serviceChildDashBoard:true,serviceChildEdit:false,isSpinner:false})
            }).catch((error)=>errorFunction(error,'update service data'))
        }
    }
    
    const dateformat=(date:Date):string=>{
        return moment(date).format("YYYY/MM/DD")
    }
    const errorFunction=(error,name)=>{
        console.log(error,name)  
        props.setChange({
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
            services:false,
            servicesEdit:false,
            isError:true,
            isSpinner:false,
        })   
        props.seterror(error)  
    }

    React.useEffect(()=>{
        if(props.formView.authentication){
            getServicesdata()
        }
    },[props.formView.authentication])
    React.useEffect(()=>{
        getProviderData()
        findStatus()
    },[serviceData])
    React.useEffect(()=>{
        getProviderDropData()
    },[])
    return(
        <div style={{boxSizing:'border-box'}}>
            <div className={styles.cancelBox}>
                <h3>Service Child Edit Form</h3>
                <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" className={styles.cancelBtn} onClick={()=>{props.setChange({...props.change,serviceChildEdit:false,serviceChildDashBoard:true}),props.setFormView({...props.formView,Id:serviceData.ServiceId})}}/>
            </div>
            <div>
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <Dropdown
                                label="Select Provider"
                                options={providerDropDown}
                                selectedKey={providerData.Id}
                                disabled={viewAuthentication}
                                onChange={(e,item)=>setServiceData({...serviceData,ProviderId:item.key})}
                            />
                        </div>
                    </div>                    
                    <h2>Provider Details</h2>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <TextField value={providerData.Name} label='Name' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={providerData.PhoneNo} label='PhoneNo' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={providerData.Email} label='Email' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={providerData.FirstAddress} label='FirstAddress' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={providerData.SecondAddress} label='SecondAddress' disabled={true}/>
                        </div>
                    </div>
                </div>
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <Dropdown
                                label="Select Client"
                                options={clientrDropDown}
                                selectedKey={clientData.Id}
                                disabled={viewAuthentication}
                                onChange={(e,item)=>setServiceData({...serviceData,ClientId:item.key})}
                            />
                        </div>
                    </div>                    
                    <h2>Client Details</h2>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <TextField value={clientData.Name} label='Name' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={clientData.PhoneNo} label='PhoneNo' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={clientData.Email} label='Email' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={clientData.FirstAddress} label='FirstAddress' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={clientData.SecondAddress} label='SecondAddress' disabled={true}/>
                        </div>
                    </div>
                </div>
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <Dropdown
                                label="Select Contructor"
                                options={contructorDropDown}
                                selectedKey={contructorData.Id}
                                disabled={viewAuthentication}
                                onChange={(e,item)=>setServiceData({...serviceData,ContructorId:item.key})}
                            />
                        </div>
                    </div>
                    <h2>Contructor Details</h2> 
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <TextField value={contructorData.Name} label='Name' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={contructorData.PhoneNo} label='PhoneNo' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={contructorData.Email} label='Email' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={contructorData.FirstAddress} label='FirstAddress' disabled={true}/>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField value={contructorData.SecondAddress} label='SecondAddress' disabled={true}/>
                        </div>
                    </div>   
                </div> 
                <h2>Services</h2> 
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <Dropdown
                                label='Select Services'
                                options={services}
                                selectedKey={serviceData.ServiceName}
                                disabled={viewAuthentication}
                                onChange={(e,item)=>setServiceData({...serviceData,ServiceName:item.text})}
                            />
                        </div>
                        <div className={styles.serviceBox}>
                            <DatePicker 
                                label='Select Date'
                                formatDate={dateformat}
                                value={serviceData.ServiceDate}
                                disabled={viewAuthentication}
                                onSelectDate={(e)=>setServiceData({...serviceData,ServiceDate:new Date(e)})}
                            />
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField label='Notes' value={serviceData.Notes} disabled={viewAuthentication} onChange={(e,text)=>setServiceData({...serviceData,Notes:text})} multiline style={{resize:'none'}}/>
                        </div>
                    </div>
                </div>   
            </div>
            {!viewAuthentication &&
            <div className={styles.serviceBtn}>
                {btnAuthntication.BookConfirm && <DefaultButton text='B & C' onClick={()=>handleUpdate('BookConfirm')}/>}

                {btnAuthntication.Complete && <DefaultButton text='Complete' onClick={()=>handleUpdate('Complete')}/>}

                {btnAuthntication.Invoice && <DefaultButton text='Invoice' onClick={()=>handleUpdate('Invoice')}/>}

                {btnAuthntication.InvoicePaid && <DefaultButton text='InvoicePaid' onClick={()=>handleUpdate('InvoicePaid')}/>}

                <DefaultButton text='Cancel' onClick={()=>{props.setChange({...props.change,serviceChildEdit:false,serviceChildDashBoard:true}),props.setFormView({...props.formView,Id:serviceData.ServiceId})}} />
            </div>}
        </div>
    )
}

export default ServiceChildEditForm