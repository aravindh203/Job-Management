import * as React from 'react';
import { useEffect,useState } from 'react';
import { IStyleSet, Label, ILabelStyles, Pivot, PivotItem, CommandBarButton, DetailsList, IColumn, SelectionMode, IconButton, Dropdown, IDropdownOption, Icon, SearchBox } from '@fluentui/react';
import {Item, sp} from "@pnp/sp/presets/all";
import styles from './AddForm.module.scss'
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import { trimStart } from '@microsoft/sp-lodash-subset';

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
    CreatedBy:string;
}

const DashBoardComponent=(props:any):JSX.Element=>{    
    const addIcon={
        root:{
            ".ms-Button-icon":{
                color:'#fff !important',
            },
            ":hover":{
                ".ms-Button-icon":{
                    color:'#fff !important',
                },
            }
        },
    }
    const list={
        root:{
            ".ms-DetailsHeader":{
                backgroundColor:'#8f3cde',
                padding:"0px"
            },
            ".ms-DetailsHeader-cell":{
                ":hover":{
                    backgroundColor:'#8f3cde',
                }
            },
            ".ms-DetailsHeader-cellTitle":{
                color:"#fff"
            }
        }
    }
    const option:IDropdownOption[]=[{
        key:'All',
        text:'All'
    },
    {
        key:'Draft',
        text:'Draft'
    },
    {
        key:'Pending',
        text:'Pending',   
    },
    {
        key:'Approved',
        text:'Approved',   
    }]

    const col:IColumn[]=[{
        key:'1',
        fieldName:'ProviderName',
        name:'Name',
        minWidth:100,
        maxWidth:150
    },
    {
        key:'2',
        fieldName:'PhoneNo',
        name:'PhoneNo',
        minWidth:100,
        maxWidth:150
    },
    {
        key:'3',
        fieldName:'ContactAdd',
        name:'ContactAdd',
        minWidth:100,
        maxWidth:150
    },
    {
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
    },
    {
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
    },
    {
        key:'8',
        fieldName:'Status',
        name:'Status',
        minWidth:100,
        maxWidth:150
    },
    {
        key:'9',
        fieldName:'Edit',
        name:'Edit',
        minWidth:100,
        maxWidth:150,
        onRender:(item)=>{
            let userAuthentication= findUserAccess(item)  
           return <IconButton iconProps={{ iconName: 'edit' }} disabled={userAuthentication} title="Edit" ariaLabel="Edit" onClick={()=>{editHandle(item)}}/>
        }
    },
    {
        key:'10',
        fieldName:'View',
        name:'View',
        minWidth:100,
        maxWidth:150,
        onRender:(item)=>(<IconButton iconProps={{ iconName: 'View' }} title="View" ariaLabel="View" onClick={()=>{viewHandle(item)}}/>)
    }]

    let addFormViewFlag=props.admin && props.manager ? true:props.admin ? true:false
    const [MData,setMData] = useState<IData[]>([])
    const [filter,setFilter] = useState<string>('All')
    const [filterData,setFilterData] = useState<IData[]>([]) 
    const [pageFilter,setPageFilter] = useState<IData[]>([])
    const[search,setSearch] = useState<string>('')
    const [pagination,setPagination] = useState({
        currentPage:1,
        displayItems:5,
    })
    
    const findUserAccess=(item:any)=>{

        let isEdit = true;

        if( props.admin &&  (item.Status=="Draft" || item.Status=="Rejected") && item.CreatedBy==props.currentUser){
            isEdit = false
        }
        else if(props.manager && item.Status!=='Draft' && item.Status!=='Rejected' ){
            isEdit = false
        }
        else if(props.admin && item.Status === 'Rejected'){
            isEdit = false
        }

        return isEdit
    }
    
    const getProviderData=async()=>{
        await sp.web.lists.getByTitle(props.list.listName).items.select('id,ProviderName,PhoneNo,ContactAdd,SecondaryAdd,NokName,NokPhoneNo,Email,Status,Author/EMail').orderBy('Modified',false).expand("Author").get().then((data)=>{
            let masterData:IData[]=[]
            if(data.length){ 
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
                        Status:item.Status ? item.Status:'',
                        CreatedBy:item.Author.EMail ? item.Author.EMail:''
                    })
                })
                
                setPageFilter(masterData)
            } 
            setMData(masterData);
            setFilterData(masterData);
            setPageFilter(masterData)  
        })
        .catch((error)=>{
            errorFunction(error,"get provider Data")
        })
    }

    const getClientData=async()=>{
        await sp.web.lists.getByTitle(props.list.listName).items.select('id,ClientName,PhoneNo,ContactAddress,SecondAddress,NokName,NokPhoneNo,Email,Status,Author/EMail').orderBy('Modified',false).expand("Author").get().then((data)=>{
            let masterData:IData[]=[]
        if(data.length){
            data.forEach((item)=>{                
                masterData.push({
                    Id:item.Id ? item.Id:null,
                    ProviderName:item.ClientName ? item.ClientName:'',
                    PhoneNo:item.PhoneNo ? item.PhoneNo:null,
                    ContactAdd:item.ContactAddress ? item.ContactAddress:'',
                    SecondaryAdd:item.SecondAddress ? item.SecondAddress:'',
                    NokName:item.NokName ? item.NokName:'',
                    NokPhoneNo:item.NokPhoneNo ? item.NokPhoneNo:null,
                    Email:item.Email ? item.Email:'',
                    Status:item.Status ? item.Status:'',
                    CreatedBy:item.Author.EMail ? item.Author.EMail:''
                })
            })
        } 
        setMData(masterData);
        setFilterData(masterData);
        setPageFilter(masterData)
        }).catch((error)=>{
            errorFunction(error,"get client Data")
        })
    }
    const getContructorData=async()=>{
        await sp.web.lists.getByTitle(props.list.listName).items.select('id,ContrctName,PhoneNo,ContactAddress,SecondAddress,NokName,NokPhoneNo,Email,Status,Author/EMail').orderBy('Modified',false).expand("Author").get().then((data)=>{
            console.log('list name',props.list.listName);
            console.log('data',data);
            let masterData:IData[]=[]
        if(data.length){
            data.forEach((item)=>{                
                masterData.push({
                    Id:item.Id ? item.Id:null,
                    ProviderName:item.ContrctName ? item.ContrctName:'',
                    PhoneNo:item.PhoneNo ? item.PhoneNo:null,
                    ContactAdd:item.ContactAddress ? item.ContactAddress:'',
                    SecondaryAdd:item.SecondAddress ? item.SecondAddress:'',
                    NokName:item.NokName ? item.NokName:'',
                    NokPhoneNo:item.NokPhoneNo ? item.NokPhoneNo:null,
                    Email:item.Email ? item.Email:'',
                    Status:item.Status ? item.Status:'',
                    CreatedBy:item.Author.EMail ? item.Author.EMail:''
                })
            })
        } 
        setMData(masterData);
        setFilterData(masterData);
        setPageFilter(masterData)
        }).catch((error)=>{
            errorFunction(error,"get contructor Data")
        })
    }

    const dropFilter=()=>{
        
        var filterData1:IData[] = [...MData].filter(value=>{
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

        let searchdata=[]
        if(filterData1.length){            
            searchdata=[...filterData1].filter((value)=>{
                return value.ProviderName.toLowerCase().startsWith(search.trimStart())
            })
        }
        setPageFilter([...searchdata])
        setFilterData([...searchdata]) 
        
    }

    const handlePageChange = () =>{
        if(props.pageRender==='Provider'){
            props.setChange({...props.change,provider:true})
        }
        else if(props.pageRender==='Client'){
            props.setChange({...props.change,client:true})
        }else if(props.pageRender==='Contructor'){
            props.setChange({...props.change,contructor:true})
        }
    }

    const editHandle=(item:IData)=>{
        props.setFormView({authentication:true,Id:item.Id,status:'edit'})

        if(props.pageRender==='Provider'){
            props.setChange({...props.change,ProviderEdit:true})
        }
        else if(props.pageRender==='Client'){
            props.setChange({...props.change,clientEdit:true})
        } else if(props.pageRender==='Contructor'){
            props.setChange({...props.change,conturctorEdit:true})
        }
    }

    const viewHandle=(item:IData)=>{
        props.setFormView({authentication:true,Id:item.Id,status:'view'})

        if(props.pageRender==='Provider'){
            props.setChange({...props.change,ProviderEdit:true})
        }
        else if(props.pageRender==='Client'){
            props.setChange({...props.change,clientEdit:true})
        }else if(props.pageRender==='Contructor'){
            props.setChange({...props.change,conturctorEdit:true})
        }
    }

    const getPagination=()=>{
        if(pageFilter.length>0){
            let lastIndex=pagination.currentPage*pagination.displayItems
            let firstIndex=lastIndex-pagination.displayItems
            let displayData=[...pageFilter].slice(firstIndex,lastIndex)
            setFilterData(displayData)    
        }
    }

    const errorFunction=(error:any,name:string)=>{
        console.log(name,error,);
    }

    useEffect(()=>{
        dropFilter()
    },[filter,search])

    useEffect(()=>{
        getPagination()
    },[pagination,pageFilter])

    useEffect(()=>{
        if(props.pageRender==='Provider'){
            getProviderData()
        }
        else if(props.pageRender==='Client'){
            getClientData()
        }else if(props.pageRender==='Contructor'){
            getContructorData()
        }     
    },[props.list])
    
    return(
        <div>
            <div>
                <Pivot selectedKey={props.pageRender}>
                    <PivotItem headerText="Provider" itemKey={'Provider'}
                        onRenderItemLink={(item)=>{
                            return <div onClick={()=>{
                                props.setPageRender(item.headerText)
                            }}>Provider</div>
                        }}/>
                    <PivotItem headerText="Client" itemKey={'Client'} onRenderItemLink={(item)=>{
                            return <div onClick={()=>{
                                props.setPageRender(item.headerText)
                            }}>Client</div>
                        }}/> 
                    <PivotItem headerText="Contructor" itemKey={'Contructor'} onRenderItemLink={(item)=>{
                            return <div onClick={()=>{
                                props.setPageRender(item.headerText)
                            }}>Contructor</div>
                        }}/>
                </Pivot>
            </div>            
            <div className={styles.btnAlign}>
                <div className={styles.dropContain}>
                    <div className={styles.dropDown}>
                        <Dropdown
                            label="Status"
                            options={option}
                            selectedKey={filter}
                            onChange={(e,item)=>setFilter(item.text)}
                        />
                    </div>
                </div>
                <div className={styles.searchBox}>
                    <div>
                        <SearchBox placeholder="Search" onChange={(e)=>setSearch(e.target.value)} disableAnimation/>
                    </div>
                    {
                        addFormViewFlag ? <CommandBarButton text='New' iconProps={{iconName:'add'}} className={styles.newButton} styles={addIcon} onClick={()=>handlePageChange()} />:null
                    }
                </div>
            </div>
            <div>
                <DetailsList items={filterData} columns={col} selectionMode={SelectionMode.none} styles={list}/>
            </div>
            <div>
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={Math.ceil(pageFilter.length/pagination.displayItems)} 
                onChange={(page) =>setPagination({...pagination,currentPage:page})}
                limiter={3} 
                />
            </div>
        </div>
    )}
            

export default DashBoardComponent;