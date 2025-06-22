function getCSRFToken() {
  const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookie ? cookie.split('=')[1] : '';
}



function calculatePrice() {
  // DBP Table
  let dbpRows = document.querySelectorAll('#dbpTable tbody tr');
  let DBP = 0;
  let Dn=0
  let DAP=0
  let Day=''
  let Totaldistance=0
  dbpRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const inputs = row.querySelectorAll('input');
    const day=cells[0].textContent
    const dn = parseFloat(inputs[0].value) ;
    Totaldistance+=dn
    Day=day
    // DBP
    if ([ 'tue', 'wed', 'thu'].includes(day.toLowerCase())) {
        DBP+=80
        Dn+=dn-3
    }else if (['mon','sat'].includes(day.toLowerCase())) {
        DBP+=90
        Dn+=dn-3.5
    } else if (['sun'].includes(day.toLowerCase())) {
        DBP+=95
        Dn+=dn-3.5
    }
    // DAP
    if (Dn>0){
        if (Dn>3){
            DAP+=30
        }else{
            DAP+=28
    }}else{
        Dn=0
    }
  });


  function timeStringToDecimalHours(time24) {
  const [hours, minutes] = time24.split(':').map(Number);
  return hours + minutes / 60;
}
  // TMF Table
  let tmfRows = document.querySelectorAll('#tmfTable tbody tr');
  let Tn=0
  let TMF = 0;
  let Tstart=0
  let Tend=0
  tmfRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const start = (inputs[0].value) ;
    const end = (inputs[1].value) ; 
    Tstart=start
    Tend=end
    let diffMs = timeStringToDecimalHours(end) -  timeStringToDecimalHours(start);
    const decimalHours = Math.round(diffMs * 100) / 100;
    let hours = Math.floor(decimalHours);   
    const minutes = Math.round((decimalHours - hours) * 60);  // Convert fractional part to minutes
    if (hours<0){
        hours+=24
    }
    Tn=(hours*100+minutes)/100
    // console.log(TotalHours); 
    let multiplier = 0;

    if (Tn <= 1) {
        multiplier = Tn * 1;
    } else if (Tn <= 2) {
        multiplier = 1 + (Tn - 1) * 1.25;
    } else if (Tn <= 3) {
        multiplier = 1  + 1 * 1.25 + (Tn - 2) * 2.2;
    } else {
        multiplier = 1 +  1.25 +  2.2; 
    }
    TMF=multiplier
  });



  // WC Table
  let wcRow = document.querySelector('#wcTable tbody tr');
  let WCTotal = 0;
    const inputs = wcRow.querySelectorAll('input');
    wcTotal = parseFloat(inputs[0].value) ; 
    if (wcTotal%3===0){
        WCTotal=5*Math.floor((wcTotal-1)/3)
    }else{
        WCTotal=5*Math.floor(wcTotal/3)}
    console.log(WCTotal)
  

  // Final calculation
  const totalPrice =DBP + (Dn * DAP)+ (Tn * TMF)  + WCTotal

  // Update UI instead of alert
  document.getElementById('priceOutput').textContent = `₹${totalPrice.toFixed(2)}`;

// the result to the backend using fetch
  fetch('/api/log/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    body: JSON.stringify({
      Day: day,                      
      DBP: DBP,                      
      DAP: DAP,                      
      Totaldistance: Dn.toFixed(2), 
      Tstart: start,                
      Tend: end,                    
      WCTotal: WCTotal,             
      total_price: totalPrice       
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Log saved:', data);
    loadHistory(); 
  })
  .catch(err => console.error('Error saving log:', err));

  return totalPrice;
}
