import * as React from 'react';
import { sp} from "@pnp/sp/presets/all";
import * as moment from 'moment';
import styles from './Services.module.scss'
import { Checkbox, DatePicker, DefaultButton, Dropdown, IDropdownOption, IconButton, TextField } from '@fluentui/react';

interface IData{
    Name:string;
    PhoneNo:string;
    Email:string;
    FirstAddress:string;
    SecondAddress:string;
    Id:number;
}
const ServiceEditForm=(props:any)=>{
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
    const Recurrence:IDropdownOption[]=[{
        key:'Daily',
        text:'Daily'
    },{
        key:'Weekly',
        text:'Weekly'
    },{
        key:'Monthly',
        text:'Monthly'
    },{
        key:'Yearly',
        text:'Yearly'
    }]
    const [providerDropDown,setProviderDropDown]=React.useState<IDropdownOption[]>([])
    const [clientrDropDown,setClientDropDown]=React.useState<IDropdownOption[]>([])
    const [contructorDropDown,setContructorDropDown]=React.useState<IDropdownOption[]>([])
    const [error,setError]=React.useState('')
    const [statusViewFlag,setStatusViewFlag]=React.useState(false)
    const [serviceData,setServiceData]=React.useState({
        ServiceName:'',
        ServiceDate:new Date(),
        Notes:'',
        Status:'',
        Files:[],
        UpdateFiles:[],
        DeleteFiles:[],
        Recurrence:false,
        RecurrenceType:'',
        StartDate:new Date(),
        EndDate:new Date(),
        RecurrenceDates:[],
        ProviderId:null,
        ClientId:null,
        ContructorId:null,
        ServiceId:null
    })    
    const [newServiceData,setNewServiceData]=React.useState(null)
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
    const findInsertData=()=>{
        
        let update
        
        if(newServiceData.RecurrenceType != serviceData.RecurrenceType || newServiceData.StartDate.toDateString() != serviceData.StartDate.toDateString() || newServiceData.EndDate.toDateString() != serviceData.EndDate.toDateString() || newServiceData.Recurrence != serviceData.Recurrence){
            update=true
        }
        else if(newServiceData.ServiceDate !== serviceData.ServiceDate || newServiceData.Notes !== serviceData.Notes || serviceData.DeleteFiles.length > 0 || serviceData.UpdateFiles.length > 0){
            update=false
        }
        return update

    }
    const getServicesdata=async()=>{
       
        await sp.web.lists.getByTitle(props.list.listName).items.select('ServiceName,ServiceDate,StartDate,EndDate,Recurrence,RecurrenceType,Notes,Status,ProviderDetailsId,ClientDetailsId,ContrctDetailsId').getById(props.formView.Id).get().then(async(result)=>{
            if(result){                
                await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.select('*').filter('Name eq'+"'"+result.Id+"'").get().then(async(res)=>{
                    await sp.web.getFolderByServerRelativePath(res[0].ServerRelativeUrl).files.get().then((item)=>{
                        setServiceData({
                            ServiceName:result.ServiceName ? result.ServiceName:'',
                            ServiceDate:result.ServiceDate ? new Date(result.ServiceDate):new Date(),
                            Notes:result.Notes ?result.Notes:'',
                            Status:result.Status ? result.Status:'',
                            Files:item ? item:[],
                            UpdateFiles:[],
                            DeleteFiles:[],
                            Recurrence:result.Recurrence ?result.Recurrence:false,
                            RecurrenceType:result.RecurrenceType ? result.RecurrenceType:'',
                            StartDate:result.StartDate ? new Date(result.StartDate):new Date(),
                            EndDate:result.EndDate ? new Date(result.EndDate):new Date(),
                            RecurrenceDates:[],
                            ProviderId:result.ProviderDetailsId ? result.ProviderDetailsId:null,
                            ClientId:result.ClientDetailsId ? result.ClientDetailsId:null,
                            ContructorId:result.ContrctDetailsId ? result.ContrctDetailsId:null,
                            ServiceId:result.Id ? result.Id:null
                        })
                        setNewServiceData({
                            ServiceDate:result.ServiceDate ? new Date(result.ServiceDate):new Date(),
                            Notes:result.Notes ?result.Notes:'',
                            Status:result.Status ? result.Status:'',
                            Files:item ? item:[],
                            UpdateFiles:[],
                            DeleteFiles:[],
                            Recurrence:result.Recurrence ?result.Recurrence:false,
                            RecurrenceType:result.RecurrenceType ? result.RecurrenceType:'',
                            StartDate:result.StartDate ? new Date(result.StartDate):new Date(),
                            EndDate:result.EndDate ? new Date(result.EndDate):new Date(),
                        })
                    }).catch((error)=>errorFunction('get files data',error))
                }).catch((error)=>errorFunction('get folder data',error))
                serviceStatusChange(result.Id)
            }
        }).catch((error)=>errorFunction('get service data',error))
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
            }).catch((error)=>errorFunction('get provider data',error))
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
            }).catch((error)=>errorFunction('get client data',error))    
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
            }).catch((error)=>errorFunction('get contructor data',error)) 
        }
    }
    const checkValidation=()=>{
        let validation=false
        if(serviceData.Recurrence){
            if(!serviceData.RecurrenceType){
                setError('Please Enter The Recurrence Type')
            }
            else if(!serviceData.StartDate){
                setError('Please Enter The Start Date')
            }
            else if(!serviceData.EndDate){
                setError('Please Enter The End Date')
            }
            else{
                validation=true
            }
        }
        else{
            validation=true
        }
        return validation
    }
    const handleUpdate=async()=>{
        let updateResult=findInsertData()
        let validation=checkValidation()
       
        if(updateResult){
            if(validation){
                props.setChange({...props.change,servicesEdit:false,isSpinner:true})
                await sp.web.lists.getByTitle('ServiceChild').items.select('*').filter("ServiceId eq"+"'"+serviceData.ServiceId+"'"+"and Status eq"+"'"+'InProgress'+"'").get().then(async(data)=>{
                    if(data.length){    
                        for(let i=0;i<data.length;i++){
                            let json={...data[i],Status:'Decline'}
                            await sp.web.lists.getByTitle('ServiceChild').items.getById(data[i].Id).update(json).then((result)=>{
                            }).catch((error)=>errorFunction('update child cancel',error))
                        }
                    }     
                    serviceStatusChange(serviceData.ServiceId)
                    addNewServiceData()           
                }).catch((error)=>errorFunction('update get service child data',error))
            }
        }else if(!updateResult){ 
                       
            props.setChange({...props.change,servicesEdit:false,isSpinner:true})
            let testJson = {
                ServiceName:serviceData.ServiceName ? serviceData.ServiceName:'',
                ServiceDate:serviceData.ServiceDate ? serviceData.ServiceDate:new Date(),
                Notes:serviceData.Notes ? serviceData.Notes:'',
                ProviderDetailsId:serviceData.ProviderId ? serviceData.ProviderId:null,
                ClientDetailsId:serviceData.ClientId ? serviceData.ClientId:null,
                ContrctDetailsId:serviceData.ContructorId ? serviceData.ContructorId:null,
            }
            await sp.web.lists.getByTitle(props.list.listName).items.getById(serviceData.ServiceId).update(testJson).then(async(response)=>{
                await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.filter('Name eq' + "'" + serviceData.ServiceId + "'").get()
                .then(async(results)=>{
                    for(let i=0;i<serviceData.DeleteFiles.length;i++){
                        await sp.web.getFileByServerRelativePath(serviceData.DeleteFiles[i].ServerRelativeUrl).delete()
                        .then(res=>console.log('del response',res))
                        .catch(error=>errorFunction('attachement delete',error))
                    }
                    for(let k=0;k<serviceData.UpdateFiles.length;k++){
                        await sp.web.getFolderByServerRelativePath(results[0].ServerRelativeUrl)
                        .files.addUsingPath(serviceData.UpdateFiles[k].name,serviceData.UpdateFiles[k], { Overwrite: true })
                        .then(result=>console.log('data updated succesfully'))
                        .catch(error=>errorFunction('attachment update',error))
                    }
                    serviceChildUpdateData()
                    props.setChange({...props.change,servicesDashBoard:true,servicesEdit:false,isSpinner:false})
                }).catch((error)=>errorFunction('update folder',error))
            }).catch((error)=>errorFunction('update service data',error))
        }
    }
    const serviceChildUpdateData=async()=>{
        await sp.web.lists.getByTitle('ServiceChild').items.select('*').filter("ServiceId eq"+"'"+serviceData.ServiceId+"'"+"and Status eq"+"'"+'InProgress'+"'").get().then(async(result)=>{
            let testJson = {
                ServiceName:serviceData.ServiceName ? serviceData.ServiceName:'',
                ServiceDate:serviceData.ServiceDate ? serviceData.ServiceDate:new Date(),
                Notes:serviceData.Notes ? serviceData.Notes:'',
                ProviderDetailsId:serviceData.ProviderId ? serviceData.ProviderId:null,
                ClientDetailsId:serviceData.ClientId ? serviceData.ClientId:null,
                ContrctDetailsId:serviceData.ContructorId ? serviceData.ContructorId:null,
            }
            for(let i=0;i<result.length;i++){
                await sp.web.lists.getByTitle('ServiceChild').items.getById(result[i].Id).update(testJson).then((data)=>{

                }).catch((error)=>errorFunction('child service update',error))
            }
        })
    }
    const serviceStatusChange=async(itemId:number)=>{
        await sp.web.lists.getByTitle('ServiceChild').items.select('*').filter("ServiceId eq"+"'"+itemId+"'").get().then((data)=>{
            
            if(data.every((value)=>value.Status==='Decline')){
                parentStatusChange(itemId,'Canceled')
            } else if(data.every((value)=>value.Status==='Complete')){
                parentStatusChange(itemId,'Completed')
            }

            if(data.every((value)=>value.Status != 'InProgress')){
                setStatusViewFlag(true)                
            }
        }).catch((error)=>errorFunction('parentStatus change',error))
    }
    
    const parentStatusChange=async(ItemId:number,status:string)=>{
        
        let json={
            Status:status
        }
        if(ItemId){
            await sp.web.lists.getByTitle('Services').items.getById(ItemId).update(json).then((data)=>{
                
            }).catch((error)=>errorFunction('parent service update',error))
        }
    }
    const addNewServiceData=async()=>{
        
        let Json={
            ServiceName:serviceData.ServiceName ? serviceData.ServiceName:'',
            ServiceDate:serviceData.ServiceDate ? serviceData.ServiceDate:new Date(),
            Notes:serviceData.Notes ? serviceData.Notes:'',
            Recurrence:serviceData.Recurrence ? serviceData.Recurrence:false,
            RecurrenceType:serviceData.RecurrenceType ? serviceData.RecurrenceType:'',
            StartDate:serviceData.StartDate ? serviceData.StartDate:new Date(),
            EndDate:serviceData.EndDate ? serviceData.EndDate:new Date(),
            ProviderDetailsId:providerData.Id ? providerData.Id:null,
            ClientDetailsId:clientData.Id ? clientData.Id:null,
            ContrctDetailsId:contructorData.Id ? contructorData.Id:null,
            Status:"InProgress"
        }
        await sp.web.lists.getByTitle("Services").items.add(Json).then(async(item)=>{
            if(serviceData.Recurrence && serviceData.RecurrenceDates.length){
                for(let i=0;i<serviceData.RecurrenceDates.length;i++){
                    let Json={
                        ServiceId:item.data.Id ? item.data.Id:null,
                        ServiceName:serviceData.ServiceName ? serviceData.ServiceName:'',
                        ServiceDate:serviceData.RecurrenceDates[i] ? serviceData.RecurrenceDates[i]:'',
                        Notes:serviceData.Notes ? serviceData.Notes:'',
                        ProviderDetailsId:providerData.Id ? providerData.Id:null,
                        ClientDetailsId:clientData.Id ? clientData.Id:null,
                        ContrctDetailsId:contructorData.Id ? contructorData.Id:null,
                        Status:"InProgress"
                    }
                    await sp.web.lists.getByTitle("ServiceChild").items.add(Json).then((item)=>{
                    }).catch((error)=>errorFunction("add services  recurrence data",error))
                }
            }
            else{
                let Json={
                    ServiceId:item.data.Id ? item.data.Id:null,
                    ServiceName:serviceData.ServiceName ? serviceData.ServiceName:'',
                    ServiceDate:serviceData.ServiceDate ? serviceData.ServiceDate:new Date(),
                    Notes:serviceData.Notes ? serviceData.Notes:'',
                    ProviderDetailsId:providerData.Id ? providerData.Id:null,
                    ClientDetailsId:clientData.Id ? clientData.Id:null,
                    ContrctDetailsId:contructorData.Id ? contructorData.Id:null,
                    Status:"InProgress"
                }
                await sp.web.lists.getByTitle("ServiceChild").items.add(Json).then((item)=>{
                }).catch((error)=>errorFunction("add services  recurrence data",error))
            }
            createFolder(item.data.Id) 
        }).catch((error)=>errorFunction("add services data",error))
    }
    const createFolder=async(itemId)=>{
        if(itemId){
            await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.addUsingPath(itemId.toString(),true).then(async(result)=>{
                                
                if(serviceData.Files.length >0){
                    for(let i=0;i<serviceData.Files.length;i++){
                        await sp.web.getFolderByServerRelativePath(result.data.ServerRelativeUrl).files.addUsingPath(serviceData.Files[i].Name, serviceData.Files[i], { Overwrite: true }).then((res)=>{
                        }).catch((error)=>errorFunction("file error",error))
                    }
                }
                if(serviceData.UpdateFiles.length >0){
                    for(let i=0;i<serviceData.UpdateFiles.length;i++){
                        await sp.web.getFolderByServerRelativePath(result.data.ServerRelativeUrl).files.addUsingPath(serviceData.UpdateFiles[i].name, serviceData.UpdateFiles[i], { Overwrite: true }).then((res)=>{
                        }).catch((error)=>errorFunction("file error",error))
                    }
                }   
                props.setChange({...props.change,servicesEdit:false,servicesDashBoard:true,isSpinner:false})
            }).catch((error)=>errorFunction("folder error",error))
        }
    }
    const handleRecurrence=(text)=>{
        setServiceData({...serviceData,
            Recurrence:text,
            ServiceDate:new Date(),
            StartDate:new Date(),
            EndDate:new Date(),
            RecurrenceType:''
        })
    }
    const fileUpload=(event)=>{
       
        let updateFiles=[]
        let fileAuthentication
        for(let i=0;i<event.target.files.length;i++){
           fileAuthentication=serviceData.Files.some(value=>{return value.Name===event.target.files[i].name})
           if(!fileAuthentication){
            updateFiles.push(event.target.files[i])
           }
        }
        
        setServiceData({...serviceData,UpdateFiles:updateFiles})  
    }
    const handleUpdateFileClose=(index)=>{
        let updateFileDelete=[...serviceData.UpdateFiles]
        updateFileDelete.splice(index,1)
        setServiceData({...serviceData,UpdateFiles:updateFileDelete})
    }
    const handleFileClose=(value,index)=>{
        let deletefiles=[...serviceData.Files]
        deletefiles.splice(index,1)
        let deletedData=[...serviceData.DeleteFiles]
        deletedData.push(value)
        setServiceData({...serviceData,Files:deletefiles,DeleteFiles:deletedData})
    }
    const dateformat=(date:Date):string=>{
        return moment(date).format("YYYY/MM/DD")
    }
    const getBetweenDates=(startDate, endDate)=> {
               
        let dates = [];
            while (startDate <= endDate) {
                dates.push(new Date(startDate));
                startDate.setDate(startDate.getDate() + 1);
            } 
            setServiceData({...serviceData,RecurrenceDates:[...dates]})
    }
    const getWeeklyDates=(startDate, endDate)=> {
        let dates = []; 
        while (startDate <= endDate) {
          dates.push(new Date(startDate));
          startDate.setDate(startDate.getDate()+7)
        }
      
        setServiceData({...serviceData,RecurrenceDates:[...dates]})
    }
    const getMonthDates=(startDate, endDate)=>{
        let dates=[]
        while(startDate<=new Date(endDate)){
            dates.push(new Date(startDate))
            startDate.setMonth(startDate.getMonth()+1)
        }  
        setServiceData({...serviceData,RecurrenceDates:[...dates]})      
    }
    const getYearDates=(startDate, endDate)=>{
        let dates=[]
        while(startDate<=new Date(endDate)){
            dates.push(new Date(startDate))
            startDate.setFullYear(startDate.getFullYear()+1)
        }  
        setServiceData({...serviceData,RecurrenceDates:[...dates]})      
    }
    const errorFunction=(name,error)=>{
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
            serviceChildDashBoard:false,
            services:false,
            servicesEdit:false,
            serviceChildEdit:false,
            isError:true,
            isSpinner:false,
        })   
        props.seterror(name)  
    }
    const getDatesFun=(startDate,endDate)=>{
        let dates=[]
        // while(startDate.toString()<=endDate.toString()){
        //     console.log("dates",moment(startDate).set('date',moment(startDate).get('date')+1))
        // }
    }
    React.useEffect(()=>{
        if(serviceData.RecurrenceType==='Daily'){
            getBetweenDates(new Date(serviceData.StartDate),new Date(serviceData.EndDate))
        }else if(serviceData.RecurrenceType==='Weekly'){
            getWeeklyDates(new Date(serviceData.StartDate),new Date(serviceData.EndDate))
        }else if(serviceData.RecurrenceType==='Monthly'){
            getMonthDates(new Date(serviceData.StartDate),new Date(serviceData.EndDate))
        }else if(serviceData.RecurrenceType==='Yearly'){
            getYearDates(new Date(serviceData.StartDate),new Date(serviceData.EndDate))
        }
        
    },[serviceData.RecurrenceType,serviceData.StartDate,serviceData.EndDate])
    React.useEffect(()=>{
        if(props.formView.authentication){
            getServicesdata()
        }
    },[props.formView.authentication])
    React.useEffect(()=>{
        getProviderData()
        getDatesFun(new Date(serviceData.StartDate),new Date(serviceData.EndDate))
    },[serviceData])
    React.useEffect(()=>{
        getProviderDropData()
    },[])
    return(
        <div style={{boxSizing:'border-box'}}>
            <div className={styles.cancelBox}>
                <h3>Service Edit Form</h3>
                <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" className={styles.cancelBtn} onClick={()=>{props.setChange({...props.change,servicesEdit:false,servicesDashBoard:true})}}/>
            </div>
            <div>
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <Dropdown
                                label="Select Provider"
                                options={providerDropDown}
                                selectedKey={providerData.Id}
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
                                onChange={(e,item)=>setServiceData({...serviceData,ServiceName:item.text})}
                            />
                        </div>
                        <div className={styles.serviceBox}>
                            <DatePicker 
                                label='Select Date'
                                formatDate={dateformat}
                                value={serviceData.ServiceDate}
                                disabled={viewAuthentication || serviceData.Recurrence || statusViewFlag}
                                onSelectDate={(e)=>setServiceData({...serviceData,ServiceDate:new Date(e)})}
                            />
                        </div>
                        <div>
                            <label className={styles.labelTag}>Files</label>
                            <input type="file" name='file' multiple onChange={(e)=>{fileUpload(e)}} disabled={viewAuthentication || statusViewFlag}/>
                            <div>
                                {
                                    serviceData.Files.map((value,index)=>{
                                        return(
                                            <div key={index}>
                                                <a href='#'>{value.Name}</a>
                                                <IconButton iconProps={{ iconName: 'Cancel' }} onClick={()=>handleFileClose(value,index)} disabled={viewAuthentication || statusViewFlag}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                {
                                    serviceData.UpdateFiles.map((value,index)=>{
                                        return(
                                            <div key={index}>
                                                <a href='#'>{value.name}</a>
                                                <IconButton iconProps={{ iconName: 'Cancel' }} onClick={()=>handleUpdateFileClose(index)} disabled={viewAuthentication || statusViewFlag}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField label='Notes' value={serviceData.Notes} disabled={viewAuthentication || statusViewFlag} onChange={(e,text)=>setServiceData({...serviceData,Notes:text})} multiline style={{resize:'none'}}/>
                        </div>
                        <div>
                            <label className={styles.labelTag}>Recurrence</label>
                            <Checkbox checked={serviceData.Recurrence} label={serviceData.Recurrence ? 'Yes':'No'} disabled={viewAuthentication || statusViewFlag} onChange={(e,text)=>handleRecurrence(text)}/>
                        </div>
                    </div>
                    <div> 
                        {serviceData.Recurrence &&
                        <div className={styles.serviceContent}>
                            <div className={styles.serviceBox}>
                                <Dropdown 
                                    label='Select Recurrence Type'
                                    options={Recurrence}
                                    selectedKey={serviceData.Recurrence ? serviceData.RecurrenceType:''}
                                    disabled={viewAuthentication || statusViewFlag}
                                    onChange={(e,item)=>setServiceData({...serviceData,RecurrenceType:item.text})}/>
                            </div>
                            <div className={styles.serviceBox}>
                                <DatePicker 
                                    label='Select Start Date'
                                    formatDate={dateformat}
                                    value={serviceData.StartDate}
                                    disabled={viewAuthentication || statusViewFlag}
                                    onSelectDate={(e)=>setServiceData({...serviceData,StartDate:new Date(e)})}
                                />
                            </div>
                            <div className={styles.serviceBox}>
                                <DatePicker 
                                    label='Select End Date'
                                    formatDate={dateformat}
                                    value={serviceData.EndDate}
                                    disabled={viewAuthentication || statusViewFlag}
                                    onSelectDate={(e)=>setServiceData({...serviceData,EndDate:new Date(e)})}
                                />
                            </div>
                        </div>
                        }
                    </div>
                </div>  
            </div>
            {error}
            {!viewAuthentication &&
            <div className={styles.serviceBtn}>
                <DefaultButton text='Update' onClick={()=>handleUpdate()}/>
                <DefaultButton text='Cancel' onClick={()=>props.setChange({...props.change,servicesEdit:false,servicesDashBoard:true})} />
            </div>}
        </div>
    )
}

export default ServiceEditForm