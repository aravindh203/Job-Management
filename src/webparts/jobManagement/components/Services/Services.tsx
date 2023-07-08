import * as React from 'react';
import { sp} from "@pnp/sp/presets/all";
import { Checkbox, DatePicker, DefaultButton, Dropdown, IDropdownOption, IconButton, TextField } from '@fluentui/react';
import * as moment from "moment"
import styles from './Services.module.scss'
interface IData{
    Name:string;
    PhoneNo:string;
    Email:string;
    FirstAddress:string;
    SecondAddress:string;
    Id:number;
}
const Services = (props:any):JSX.Element=>{
    let approve:string='Approve'
    const select=[{
        key:'Select',
        text:'Select'
    }]
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
    const [Service,setService]=React.useState({
        serviceName:'',
        serviceDate:null,
        serviceNotes:'',
        files:[],
        Recurrence:false,
        RecurrenceType:'',
        StartDate:'',
        EndDate:'',
        RecurrenceDates:[]
    })    
    console.log("servicwes",Service);
    
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
    const [selectDrop,setSelectDrop]=React.useState({
        listName:'',
        items:null
    })
    
    const getProviderData=async()=>{
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
                getClientData()
            }
        }).catch((error)=>errorFunction("get provider data",error))
    }

    const getClientData=async()=>{
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
                getContructorData()
            }
        }).catch((error)=>errorFunction("get client data",error))
    }

    const getContructorData=async()=>{
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

    const getMasterData=async(value:any)=>{

        let findPerson=''
        let fAddress=''
        let sAddresss=''
        if(value.listName==='ProviderList'){
            findPerson='ProviderName'
            fAddress='ContactAdd'
            sAddresss='SecondaryAdd'
        }else if(value.listName==='Client'){
            findPerson='ClientName'
            fAddress='ContactAddress'
            sAddresss='SecondAddress'
        }else{
            findPerson='ContrctName'
            fAddress='ContactAddress'
            sAddresss='SecondAddress'
        }
        if(value.items['key']){
            await sp.web.lists.getByTitle(value.listName).items.select('*').getById(value.items['key']).get().then((data)=>{
            
                let Data:IData={
                    Name:data[findPerson] ? data[findPerson]:'',
                    PhoneNo:data.PhoneNo ? data.PhoneNo:'',
                    Email:data.Email ? data.Email:'',
                    FirstAddress:data[fAddress] ? data[fAddress]:'',
                    SecondAddress:data[sAddresss] ? data[sAddresss]:'',
                    Id:data.Id ? data.Id:null
                }

                if(value.listName==='ProviderList'){
                    setProviderData({...Data})
                }else if(value.listName==='Client'){
                    setClientData({...Data})
                }else{
                    setContructorData({...Data})
                }
                
            }).catch((error)=>errorFunction("get services data",error))
        }
    }
    const handleValidation=()=>{
        let valueNotEmpty=false
        if(!providerData.Name){
            setError('Please Select Provider')
        }
        else if(!clientData.Name){
            setError('Please Select Client')
        }
        else if(!contructorData.Name){
            setError('Please Select Contructor')
        }
        else if(!Service.serviceName){
            setError('Please Enter The Service Name')
        }
        else if(!Service.Recurrence && !Service.serviceDate){
            setError('Please Enter The Service Date')
        }
        else if(Service.Recurrence){
            if(!Service.RecurrenceType){
                setError('Please Enter Recurrence Type')
            }
            else if(!Service.StartDate){
                setError('Please Enter Start Date')
            }
            else if(!Service.EndDate){
                setError('Please Enter End Date')
            }
            else{
                valueNotEmpty=true
            }
        }
        else{
            valueNotEmpty=true
        }
        return valueNotEmpty
    }
    const handleSubmit=async()=>{
        let validation=handleValidation()
        if(validation){
            props.setChange({...props.change,services:false,isSpinner:true})
            let Json={
                ServiceName:Service.serviceName ? Service.serviceName:'',
                ServiceDate:Service.serviceDate ? Service.serviceDate:new Date(),
                Notes:Service.serviceNotes ? Service.serviceNotes:'',
                StartDate:Service.StartDate ? Service.StartDate:new Date(''),
                EndDate:Service.EndDate ? Service.EndDate:new Date(''),
                ProviderDetailsId:providerData.Id ? providerData.Id:null,
                ClientDetailsId:clientData.Id ? clientData.Id:null,
                ContrctDetailsId:contructorData.Id ? contructorData.Id:null,
                Status:"InProgress"
            }
            await sp.web.lists.getByTitle("Services").items.add(Json).then(async(item)=>{
                if(Service.RecurrenceDates.length){
                    for(let i=0;i<Service.RecurrenceDates.length;i++){
                        let Json={
                            ServiceId:item.data.Id ? item.data.Id:null,
                            ServiceName:Service.serviceName ? Service.serviceName:'',
                            ServiceDate:Service.RecurrenceDates[i] ? Service.RecurrenceDates[i]:'',
                            Notes:Service.serviceNotes ? Service.serviceNotes:'',
                            ProviderDetailsId:providerData.Id ? providerData.Id:null,
                            ClientDetailsId:clientData.Id ? clientData.Id:null,
                            ContrctDetailsId:contructorData.Id ? contructorData.Id:null,
                            Status:"InProgress"
                        }
                        await sp.web.lists.getByTitle("ServiceChild").items.add(Json).then((item)=>{
                        }).catch((error)=>errorFunction("add services  recurrence data",error))
                    }
                }
                createFolder(item.data.Id) 
            }).catch((error)=>errorFunction("add services data",error))
        }
    }
    const fileUpload=(data)=>{
        let filesData=[]
        for(let i=0;i<data.length;i++){
            filesData.push(data[i])
        }
        setService({...Service,files:filesData})
    }
    const handleFileClose=(index)=>{
        let deleteFile=[...Service.files]
        deleteFile.splice(index,1)
        setService({...Service,files:deleteFile})
    }
    const createFolder=async(itemId)=>{
        if(itemId){
            await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.addUsingPath(itemId.toString(),true).then(async(result)=>{
                if(Service.files.length > 0){
                    for(let i=0;i<Service.files.length;i++){
                        await sp.web.getFolderByServerRelativePath(result.data.ServerRelativeUrl).files.addUsingPath(Service.files[i].name, Service.files[i], { Overwrite: true }).then((res)=>{
                            props.setChange({...props.change,services:false,servicesDashBoard:true,isSpinner:false})
                        }).catch((error)=>errorFunction("file error",error))
                    }
                }else{
                    props.setChange({...props.change,services:false,servicesDashBoard:true,isSpinner:false})
                }
            }).catch((error)=>errorFunction("folder error",error))
        }
    }
    const errorFunction=(error,name)=>{
        console.log(error,name);  
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
    
    const getBetweenDates=(startDate, endDate)=> {
               
        let dates = [];
            while (startDate <= endDate) {
                dates.push(new Date(startDate));
                startDate.setDate(startDate.getDate() + 1);
            } 
            setService({...Service,RecurrenceDates:[...dates]})
    }
    const getWeeklyDates=(startDate, endDate)=> {
        let dates = []; 
        while (startDate <= endDate) {
          dates.push(new Date(startDate));
          startDate.setDate(startDate.getDate()+7)
        }
      
        setService({...Service,RecurrenceDates:[...dates]})
    }
    const getMonthDates=(startDate, endDate)=>{
        let dates=[]
        while(startDate<=new Date(endDate)){
            dates.push(new Date(startDate))
            startDate.setMonth(startDate.getMonth()+1)
        }  
        setService({...Service,RecurrenceDates:[...dates]})      
    }
    const getYearDates=(startDate, endDate)=>{
        let dates=[]
        while(startDate<=new Date(endDate)){
            dates.push(new Date(startDate))
            startDate.setFullYear(startDate.getFullYear()+1)
        }  
        setService({...Service,RecurrenceDates:[...dates]})      
    }
    
    React.useEffect(()=>{
        if(Service.RecurrenceType==='Daily'){
            getBetweenDates(new Date(Service.StartDate),new Date(Service.EndDate))
        }else if(Service.RecurrenceType==='Weekly'){
            getWeeklyDates(new Date(Service.StartDate),new Date(Service.EndDate))
        }else if(Service.RecurrenceType==='Monthly'){
            getMonthDates(new Date(Service.StartDate),new Date(Service.EndDate))
        }else if(Service.RecurrenceType==='Yearly'){
            getYearDates(new Date(Service.StartDate),new Date(Service.EndDate))
        }
        
    },[Service.StartDate,Service.EndDate])
    React.useEffect(()=>{
         getMasterData(selectDrop)   
    },[selectDrop])
    React.useEffect(()=>{
        getProviderData()
    },[])
    return(
        <div style={{boxSizing:'border-box'}}>
            <div className={styles.cancelBox}>
                <h3>Service Add Form</h3>
                <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" className={styles.cancelBtn} onClick={()=>{props.setChange({...props.change,services:false,servicesDashBoard:true})}}/>
            </div>
            <div>
                <div className={styles.serviceContainer}>
                    <div className={styles.serviceContent}>
                        <div className={styles.serviceBox}>
                            <Dropdown
                                label="Select Provider"
                                options={providerDropDown}
                                onChange={(e,item)=>setSelectDrop({listName:"ProviderList",items:item})}
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
                                onChange={(e,item)=>setSelectDrop({listName:"Client",items:item})}
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
                                onChange={(e,item)=>setSelectDrop({listName:"Contructor",items:item})}
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
                                onChange={(e,item)=>setService({...Service,serviceName:item.text})}
                            />
                        </div>
                        <div className={styles.serviceBox}>
                            <DatePicker 
                                label='Select Date'
                                onSelectDate={(e)=>setService({...Service,serviceDate:moment(e).format('YYYY/MM/DD')})}
                            />
                        </div>
                        <div>
                            <label className={styles.labelTag}>Files</label>
                            <input type="file" name='file' multiple onChange={(e)=>{fileUpload(e.target.files)}}/>
                            <div>
                                {
                                    Service.files.map((value,index)=>{
                                        return(
                                            <div key={index}>
                                                <a href='#'>{value.name}</a>
                                                <IconButton iconProps={{ iconName: 'Cancel' }} onClick={()=>handleFileClose(index)}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className={styles.serviceBox}>
                            <TextField label='Notes' onChange={(e,text)=>setService({...Service,serviceNotes:text})} multiline style={{resize:'none'}}/>
                        </div>
                        <div className={''}>
                            <label className={styles.labelTag}>Recurrence</label>
                            <Checkbox checked={Service.Recurrence} label={Service.Recurrence ? 'Yes':'No'} onChange={(e,text)=>setService({...Service,Recurrence:text})}/>
                        </div>
                    </div>
                    <div>
                    {Service.Recurrence &&
                            <div className={styles.serviceContent}>
                                <div className={styles.serviceBox}>
                                    <Dropdown 
                                        label='Select Recurrence Type'
                                        options={Recurrence}
                                        onChange={(e,item)=>setService({...Service,RecurrenceType:item.text})}/>
                                </div>
                                <div className={styles.serviceBox}>
                                    <DatePicker 
                                        label='Select Start Date'
                                        onSelectDate={(e)=>setService({...Service,StartDate:moment(e).format('YYYY-MM-DD')})}
                                    />
                                </div>
                                <div className={styles.serviceBox}>
                                    <DatePicker 
                                        label='Select End Date'
                                        onSelectDate={(e)=>setService({...Service,EndDate:moment(e).format('YYYY-MM-DD')})}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>   
            </div>
            <div className={styles.serviceBtn}>
                {error}
                <DefaultButton text='Submit' onClick={()=>handleSubmit()}/>
                <DefaultButton text='Cancel' onClick={()=>props.setChange({...props.change,services:false,servicesDashBoard:true})} />
            </div>
        </div>
    )
}
export default Services