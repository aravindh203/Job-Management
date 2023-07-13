import * as React from 'react';
import { useEffect,useState } from 'react';
import { Pivot, PivotItem, CommandBarButton, DetailsList, IColumn, SelectionMode, IconButton, Dropdown, IDropdownOption, Icon, SearchBox } from '@fluentui/react';
import { sp} from "@pnp/sp/presets/all";
import styles from './../AddForm.module.scss'
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import * as moment from 'moment';

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

    const addFormViewFlag=props.admin && props.manager ? true:props.admin ? true:false
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
            },
            // ".ms-DetailsRow-fields":{
            //     ".ms-DetailsRow-cell":{
            //         ":nth-child(3)":{
            //             background:'red',
            //             animation: 'blink 1s infinite'
            //         }
            //     }
            // }
        }
    }

    const option:IDropdownOption[]=[
        {
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
            key:'Approve',
            text:'Approve',   
        }
    ]
    const col:IColumn[]=[
        {
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
        },
        {
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
        },
        {
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
            maxWidth:150,
            // onRender:(item)=>{
            //     if(item.Status==='Approve'){
            //         return <div className='rowcol'>{item.Status}</div>
            //     }else{
            //         return <div>{item.Status}</div>
            //     }
            // }
        },
        {
            key:'9',
            fieldName:'Edit',
            name:'Edit',
            minWidth:100,
            maxWidth:150,
            onRender:(item)=>{
                let userAuthentication= findUserAccess(item)  
            return <IconButton iconProps={{ iconName: 'edit' }} disabled={userAuthentication} title="Edit" ariaLabel="Edit" onClick={()=>{viewEditHnadle(item,'edit')}}/>
            }
        },
        {
            key:'10',
            fieldName:'View',
            name:'View',
            minWidth:100,
            maxWidth:150,
            onRender:(item)=>(<IconButton iconProps={{ iconName: 'View' }} title="View" ariaLabel="View" onClick={()=>{viewEditHnadle(item,'view')}}/>)
        }
    ]
    
    const [MData,setMData] = useState<IData[]>([])
    const [filter,setFilter] = useState<string>('All')
    const [filterData,setFilterData] = useState([]) 
    const [pageFilter,setPageFilter] = useState([])
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
        else if(props.manager && item.Status!=='Draft' && item.Status!=='Rejected' && item.Status!=="Approve" ){
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
                setMData(masterData);
                setPageFilter(masterData)  
            } else{
                setMData([])
                setPageFilter([])
            }
            
        })
        .catch((error)=>{
            errorFunction(error,"get provider Data")
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
            else if(filter==="Approve"){  
                return value.Status==='Approve'
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
            props.setChange({...props.change,
                providerDashBoard:false,
                provider:true,
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
                isError:false,
                isSpinner:false,
            })
    }

    const viewEditHnadle = (item:IData,clickStatus:string)=>{

        props.setFormView({authentication:true,Id:item.Id,status:clickStatus})
        props.setChange({...props.change,
            providerDashBoard:false,
            provider:false,
            ProviderEdit:true,
            clientDashBoard:false,
            client:false,
            clientEdit:false,
            contructorDashBoard:false,
            contructor:false,
            conturctorEdit:false,
            servicesDashBoard:false,
            services:false,
            servicesEdit:false,
            isError:false,
            isSpinner:false,
        })
    }

    const getPagination=()=>{

        if(pageFilter.length){
            let lastIndex=pagination.currentPage*pagination.displayItems
            let firstIndex=lastIndex-pagination.displayItems
            let displayData=[...pageFilter].slice(firstIndex,lastIndex)
            setFilterData(displayData)                
        }
        else{
            setFilterData([])
        }
    }

    const errorFunction=(error:any,name:string)=>{
        console.log(name,error);
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

    useEffect(()=>{
        dropFilter()
    },[filter,search])
    useEffect(()=>{
        getPagination()
    },[pagination,pageFilter])
    useEffect(()=>{
        getProviderData()
    },[])
    
    return(
        <div>        
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
            {filterData.length ? 
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.ceil(pageFilter.length/pagination.displayItems)} 
                    onChange={(page) =>setPagination({...pagination,currentPage:page})}
                    limiter={3} 
                    />:
                <h3 style={{margin:'5px 0px',textAlign:'center'}}>No Result Data</h3>}
            </div>
        </div>
    )}
            

export default DashBoardComponent;