import * as React from 'react';
import { IStyleSet, Label, ILabelStyles, Pivot, PivotItem, CommandBarButton, DetailsList, IColumn, SelectionMode, IconButton, Dropdown, IDropdownOption } from '@fluentui/react';
import {sp} from "@pnp/sp/presets/all";
import styles from './AddForm.module.scss'

interface IData{
    Id:number;
    ProviderName:string;
    PhoneNo:number;
    ContactAdd:string;
    SecondaryAdd:string;
    NokName:string;
    NokPhoneNo:number;
    Email:string;
    Status:string;
}
const DashBoardComponent=(props:any):JSX.Element=>{    
    const addIcon={
        root:{
            ".ms-Icon":{
                color:'white'
            }
        }
    }
    const option:IDropdownOption[]=[{
        key:'All',
        text:'All'
    },{
        key:'Draft',
        text:'Draft'
    },{
        key:'Pending',
        text:'Pending',   
    },{
        key:'Approved',
        text:'Approved',   
    }]
    const col:IColumn[]=[{
        key:'1',
        fieldName:'ProviderName',
        name:'ProviderName',
        minWidth:100,
        maxWidth:150
    },{
        key:'2',
        fieldName:'PhoneNo',
        name:'PhoneNo',
        minWidth:100,
        maxWidth:150
    },{
        key:'3',
        fieldName:'ContactAdd',
        name:'ContactAdd',
        minWidth:100,
        maxWidth:150
    },{
        key:'4',
        fieldName:'SecondaryAdd',
        name:'SecondaryAdd',
        minWidth:100,
        maxWidth:150
    },{
        key:'5',
        fieldName:'NokName',
        name:'NokName',
        minWidth:100,
        maxWidth:150
    },{
        key:'6',
        fieldName:'NokPhoneNo',
        name:'NokPhoneNo',
        minWidth:100,
        maxWidth:150
    },{
        key:'7',
        fieldName:'Email',
        name:'Email',
        minWidth:100,
        maxWidth:150
    },{
        key:'8',
        fieldName:'Status',
        name:'Status',
        minWidth:100,
        maxWidth:150
    },{
        key:'9',
        fieldName:'Edit',
        name:'Edit',
        minWidth:100,
        maxWidth:150,
        onRender:(item)=>(<IconButton iconProps={{ iconName: 'edit' }} title="Edit" ariaLabel="Edit" onClick={()=>{props.setFormView({authentication:true,Id:item.Id,status:'edit'})}}/>)
    },{
        key:'10',
        fieldName:'View',
        name:'View',
        minWidth:100,
        maxWidth:150,
        onRender:(item)=>(<IconButton iconProps={{ iconName: 'View' }} title="View" ariaLabel="View" onClick={()=>{props.setFormView({authentication:true,Id:item.Id,status:'view'})}}/>)
    }]

    const [pageRender,setPageRender]=React.useState('Provider')
    const [MData,setMData]=React.useState<IData[]>([])
    const [filter,setFilter]=React.useState('All')
    const [filterData,setFilterData]=React.useState<IData[]>([])
    
    
    const getData=async()=>{
        await sp.web.lists.getByTitle("ProviderList").items.select('id,ProviderName,PhoneNo,ContactAdd,SecondaryAdd,NokName,NokPhoneNo,Email,Status').get().then((data)=>{
            
            let masterData:IData[]=[]
            data.forEach((item)=>{
                masterData.push({
                    Id:item.Id ? item.Id:null,
                    ProviderName:item.ProviderName ? item.ProviderName:'',
                    PhoneNo:item.PhoneNo ? item.PhoneNo:null,
                    ContactAdd:item.ContactAdd ? item.ContactAdd:'',
                    SecondaryAdd:item.SecondaryAdd ? item.SecondaryAdd:'',
                    NokName:item.NokName ? item.NokName:'',
                    NokPhoneNo:item.NokPhoneNo ? item.NokPhoneNo:null,
                    Email:item.Email ? item.Email:'',
                    Status:item.Status ? item.Status:''
                })
            })
            setMData(masterData);
            setFilterData(masterData);
        }).catch((error)=>{
            errorFunction(error,"getData")
        })
    }
    const dropFilter=()=>{
        
        var filterData1 = [...MData].filter(value=>{
            if(filter==="Draft"){
                return value.Status==='Draft'
            }
            else if(filter==="Pending"){
                return value.Status==='Pending'    
            }
            else if(filter==="Approved"){  
                return value.Status==='Approved'
            }
            else{
                return value
            }
        })
         
        setFilterData([...filterData1])
    }

    const errorFunction=(error:any,name:string)=>{
        console.log("error",error,name);
    }

    const handlePageChnage = () =>{
        if(pageRender==='Provider'){
            props.setChange({...props.change,provider:true})
        }
        
    }

    React.useEffect(()=>{
        dropFilter()
    },[filter])

    React.useEffect(()=>{
        getData()
    },[])
    
    return(
        <div>
            <div className={styles.btnAlign}>
                <div>
                    <Pivot aria-label="Basic Pivot Example">
                        <PivotItem headerText="Provider" 
                            onRenderItemLink={(item)=>{
                                return <div onClick={()=>{
                                    setPageRender(item.headerText)
                                }}>Provider</div>
                            }}/>
                        <PivotItem headerText="Client" onRenderItemLink={(item)=>{
                                return <div onClick={()=>{
                                    setPageRender(item.headerText)
                                }}>Client</div>
                            }}/>
                        <PivotItem headerText="Contructor" onRenderItemLink={(item)=>{
                                return <div onClick={()=>{
                                    setPageRender(item.headerText)
                                }}>Contructor</div>
                            }}/>
                    </Pivot>
                </div>
                <div>
                    <CommandBarButton text='New' iconProps={{iconName:'add'}} className={styles.newButton} styles={addIcon} onClick={()=>handlePageChnage()} />
                </div>
            </div>
            <div>
            <Dropdown
                label="Status"
                options={option}
                selectedKey={filter}
                onChange={(e,item)=>setFilter(item.text)}
            />
            </div>
            <div>
                <DetailsList items={filterData} columns={col} selectionMode={SelectionMode.none}/>
            </div>
        </div>)}
            

export default DashBoardComponent;