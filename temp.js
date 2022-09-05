let arr1 = ['a','b','c','x'];
let arr2 = ['z','y','a'];

function containsCommonItems(){
    let map = {};
    for(let i=0; i<arr1.length ;i++){
        if(!map[arr1[i]]){
            const items = arr1[i];
            map[items] = true;
        }
    }
    
    for(let j=0; j<arr2.length ;j++){
        console.log(map);
        console.log(map[arr2[j]]);
    }
}

containsCommonItems();