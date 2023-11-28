import { getCurrentInstance } from "vue"

function loadContext() {
    let context = localStorage.context;
    if(context) {
        return JSON.parse(context)
    }
}
function storeContext(context) {
    localStorage.context = JSON.stringify(context);
}

storeContext({
    companies: [{
        companyId:1,
        companyName:"公司1",
        products:[{
            productId:1,
            productName:'项目1'
        },{
            productId:1,
            productName:'项目1'
        }]
    },{
        companyId:2,
        companyName:"公司2",
        products:[{
            productId:3,
            productName:'项目3'
        },{
            productId:4,
            productName:'项目4'
        }]
    }],
    currentCompany: {
        companyId:1,
        companyName:"公司1",
        products:[{
            productId:1,
            productName:'项目1'
        },{
            productId:1,
            productName:'项目1'
        }]
    }
})

export {
    loadContext,
    storeContext
}