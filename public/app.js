//price transformation//
const toCurrency = price =>{
   return new Intl.NumberFormat('ru-Ru',{
      currency: 'rub',
      style: 'currency'
   }).format(price)
}
document.querySelectorAll('.price').forEach(node=>{
     node.textContent = toCurrency(node.textContent)
})

//date transformation//
const toDate = date =>{
   return new Intl.DateTimeFormat('ru-Ru',{
      day: '2-digit',
      month: 'long',
      year: 'numeric' ,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'


   }).format(new Date(date))
}
document.querySelectorAll('.date').forEach(node=>{
   node.textContent = toDate(node.textContent)
})

///json update card//
const $card = document.querySelector('#card')
if($card){
   $card.addEventListener('click', event => {
      if(event.target.classList.contains('js-remove')){
         const id = event.target.dataset.id
         const csrf = event.target.dataset.csrf
         fetch(`/card/remove/${id}`,{
            method: 'delete',
            headers:{
               'X-XSRF-token': csrf
            },
         })
         .then(res=> res.json())
         .then(card=>{
            if(card.courses.length){
               const html = card.courses.map(c => {
                 return `
                  <tr>
                     <td>${c.title}</td>
                     <td>${c.count}</td>
                     <td>
                        <button class="btn btn-primary js-remove" data-id="${id}" data-csrf="{{@root.csrf}}"
                        >Удалить
                        </button>
                     </td>
                  </tr>`
               }).join('')
               $card.querySelector('tbody').innerHTML = html
               $card.querySelector('.price').textContent = toCurrency(card.price)
            }else{
               $card.innerHTML = '<p>Корзина пуста</p>'
            }
         })
         .catch(err=>console.log(err))
      }
   })
}



var instance = M.Tabs.init(document.querySelectorAll('.tabs'));
var instances = M.Sidenav.init(document.querySelectorAll('.sidenav'));