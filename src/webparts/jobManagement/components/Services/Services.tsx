import * as React from 'react';
import { sp} from "@pnp/sp/presets/all";
import { DatePicker, DefaultButton, Dropdown, IDropdownOption, IconButton, TextField } from '@fluentui/react';
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
    const [Service,setService]=React.useState({
        serviceName:'',
        serviceDate:null,
        serviceNotes:'',
        files:[]
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
    const [selectDrop,setSelectDrop]=React.useState({
        listName:'',
        items:null
    })
   
    const getProviderData=async()=>{
        await sp.web.lists.getByTitle('ProviderList').items.select('id,ProviderName,Status').filter('Status eq ' + "'" + approve + "'").get().then((items)=>{
            let ProviderDrop=[];
            items.forEach((item)=>{
                ProviderDrop.push({
                    key:item.Id,
                    text:item.ProviderName
                })
            })
            setProviderDropDown(ProviderDrop)
            getClientData()
        }).catch((error)=>errorFunction("get provider data",error))
    }

    const getClientData=async()=>{
        await sp.web.lists.getByTitle('Client').items.select('id,ClientName,Status').filter('Status eq ' + "'" + approve + "'").get().then((items)=>{
            let ClientDrop=[];
            items.forEach((item)=>{
                ClientDrop.push({
                    key:item.Id,
                    text:item.ClientName
                })
            })
            setClientDropDown(ClientDrop)
            getContructorData()
        }).catch((error)=>errorFunction("get client data",error))
    }

    const getContructorData=async()=>{
        await sp.web.lists.getByTitle('Contructor').items.select('id,ContrctName,Status').filter('Status eq ' + "'" + approve + "'").get().then((items)=>{
            let ContructorDrop=[]
            items.forEach((item)=>{
                ContructorDrop.push({
                    key:item.Id,
                    text:item.ContrctName
                })
            })
            setContructorDropDown(ContructorDrop)
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

        await sp.web.lists.getByTitle(value.listName).items.select('*').getById(value.items['key']).get().then((data)=>{
           
            let Data:IData={
                Name:data[findPerson],
                PhoneNo:data.PhoneNo,
                Email:data.Email,
                FirstAddress:data[fAddress],
                SecondAddress:data[sAddresss],
                Id:data.Id
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
    const handleSubmit=async()=>{
        props.setChange({...props.change,services:false,isSpinner:true})
        let Json={
            ServiceName:Service.serviceName,
            ServiceDate:Service.serviceDate,
            Notes:Service.serviceNotes,
            ProviderDetailsId:providerData.Id,
            ClientDetailsId:clientData.Id,
            ContrctDetailsId:contructorData.Id,
            Status:"InProgress"
        }
        await sp.web.lists.getByTitle("Services").items.add(Json).then((item)=>{
            // props.setChange({...props.change,services:false,isSpinner:false})
            createFolder(item.data.Id)            
        }).catch((error)=>errorFunction("add services data",error))
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
        await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.addUsingPath(itemId.toString(),true).then(async(result)=>{
            for(let i=0;i<Service.files.length;i++){
                await sp.web.getFolderByServerRelativePath(result.data.ServerRelativeUrl).files.addUsingPath(Service.files[i].name, Service.files[i], { Overwrite: true }).then((res)=>{
                    props.setChange({...props.change,services:false,isSpinner:false})
                }).catch((error)=>errorFunction("file error",error))
            }
            
        }).catch((error)=>errorFunction("folder error",error))
    }
    const errorFunction=(error,name)=>{
        console.log(error,name);  
        props.setChange({
            provider:false,
            ProviderEdit:false,
            client:false,
            clientEdit:false,
            contructor:false,
            conturctorEdit:false,
            isError:true,
            isSpinner:false
        })      
    }
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
                <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" className={styles.cancelBtn} onClick={()=>{props.setChange({...props.change,services:false})}}/>
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
                    </div>
                </div>   
            </div>
            <div className={styles.serviceBtn}>
                <DefaultButton text='Submit' onClick={()=>handleSubmit()}/>
                <DefaultButton text='Cancel' onClick={()=>props.setChange({...props.change,services:false,isSpinner:false})} />
            </div>
        </div>
    )
}
export default Services