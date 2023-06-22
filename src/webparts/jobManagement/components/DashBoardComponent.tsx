import * as React from 'react';
import { IStyleSet, Label, ILabelStyles, Pivot, PivotItem, CommandBarButton, DetailsList, IColumn, SelectionMode, IconButton, Dropdown, IDropdownOption, Icon, SearchBox } from '@fluentui/react';
import {sp} from "@pnp/sp/presets/all";
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
        onRender:(item)=>{
            var managerAuthentication = item.Status === 'Draft' ? true:false;            
            var adminAuthentication =  item.Status === 'Pending' ? true:false;
            console.log('adminAuthentication',adminAuthentication);

            if(props.user==='Admin'){
                return <IconButton iconProps={{ iconName: 'edit' }} disabled={adminAuthentication} title="Edit" ariaLabel="Edit" onClick={()=>{editHandle(item)}}/>
            }
            else if(props.user==='Manager'){
                return <IconButton iconProps={{ iconName: 'edit' }} disabled={managerAuthentication} title="Edit" ariaLabel="Edit" onClick={()=>{editHandle(item)}}/>
            }
            else{
                return <IconButton iconProps={{ iconName: 'edit' }} disabled={true} title="Edit" ariaLabel="Edit" onClick={()=>{editHandle(item)}}/>
            }
        }
    },{
        key:'10',
        fieldName:'View',
        name:'View',
        minWidth:100,
        maxWidth:150,
        onRender:(item)=>(<IconButton iconProps={{ iconName: 'View' }} title="View" ariaLabel="View" onClick={()=>{viewHandle(item)}}/>)
    }]
    
    const [pageRender,setPageRender]=React.useState<string>('Provider')
    const [MData,setMData]=React.useState<IData[]>([])
    const [filter,setFilter]=React.useState<string>('All')
    const [filterData,setFilterData]=React.useState<IData[]>([])
    const [pagination,setPagination]=React.useState({
        currentPage:1,
        displayItems:5,
    }) 
    const [pageFilter,setPageFilter]=React.useState<IData[]>([])
    const[search,setSearch]=React.useState<string>('')
   
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
            setPageFilter(masterData)
        }).catch((error)=>{
            errorFunction(error,"getData")
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


        var searchdata=[]
        if(filterData1.length){
            console.log('hello');
            
            searchdata=[...filterData1].filter((value)=>{
                return value.ProviderName.toLowerCase().startsWith(search.trimStart())
            })
        }
        console.log('searchdata',searchdata);
        setPageFilter([...searchdata])
        setFilterData([...searchdata]) 
        
    }
    const handlePageChange = () =>{
        if(pageRender==='Provider'){
            props.setChange({...props.change,provider:true})
        }
    }
    const editHandle=(item:IData)=>{
        props.setFormView({authentication:true,Id:item.Id,status:'edit'})

        if(pageRender==='Provider'){
            props.setChange({...props.change,ProviderEdit:true})
        }
    }
    const viewHandle=(item:IData)=>{
        props.setFormView({authentication:true,Id:item.Id,status:'view'})

        if(pageRender==='Provider'){
            props.setChange({...props.change,ProviderEdit:true})
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
        console.log("error",error,name);
    }
    React.useEffect(()=>{
        dropFilter()
    },[filter,search])
    React.useEffect(()=>{
        getPagination()
    },[pagination,pageFilter])
    React.useEffect(()=>{
        getData()  
    },[])
    
    return(
        <div>
            <div>
                <Pivot>
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
                <div>
                    <div>
                    <SearchBox placeholder="Search" onChange={(e)=>setSearch(e.target.value)} disableAnimation/>
                    </div>
                    {
                        props.user==='Admin' ? <CommandBarButton text='New' iconProps={{iconName:'add'}} className={styles.newButton} styles={addIcon} onClick={()=>handlePageChange()} />:null

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
        </div>)}
            

export default DashBoardComponent;