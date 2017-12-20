		function btnset () {
			$('#radioDiv').buttonset();
		};
		
		function getCurrency () {
			
			$.ajax({
				url: 'https://koronapay.com/exchange/api/currencies/rates/',
				dataType: 'json'
			})
			.done(function(data) {
				if (data) {
					$("#label_usd").text("$ "+data["0"].prices["0"].value);
					$("#label_eur").text("€ "+data["1"].prices["0"].value);
					
					document.getElementById('usd').value = data["0"].prices["0"].value;
					document.getElementById('eur').value = data["1"].prices["0"].value;
					
				}
			});
		};
		
		function validation (value) {
			$('.error').text("");
			var regexp = /^\d+$/;
			var usd = document.getElementById('usd');
			var eur = document.getElementById('eur');
			if (value.match(regexp)||value=='') 
			$('.error').text("")
			else  {$('.error').text("Неправильные данные");	
				$(".b-payment-sum").text("0 RUB");
				return;}
			
			
			$.ajax({
				url: 'https://koronapay.com/exchange/api/currencies/rates/',
				dataType: 'json'
			})
			.done(function(data) {
				if (data) {
					
					for(l=0; l<data.length; l++){
						if (usd.checked && (data[l].currency.code=="USD")){
							var currency = usd;
							var i = l;
						};
						if (eur.checked && (data[l].currency.code=="EUR")){
							var currency = eur;
							var i = l;
						};
					};
					
					exchange(currency,i, value, data);
					
					function exchange (currency, i,value, data) {
					    if (value==''){$('.error').text("");
							return;};
					
						if (value<data[i].prices[0].minVolume/data[i].volumeMultiplicity)
						{$('.error').text("Сумма должна быть больше "+data[i].prices[0].minVolume/data[i].volumeMultiplicity);
						$(".b-payment-sum").text("0 RUB");
							return;};
						if (value>data[i].prices[data[i].prices.length-1].maxVolume/data[i].volumeMultiplicity)
						{$('.error').text("Сумма должна быть меньше "+data[i].prices[data[i].prices.length-1].maxVolume/data[i].volumeMultiplicity);
							$(".b-payment-sum").text("0 RUB");
							return;};
						
						for(k=0; k<data[i].prices.length; k++){
							if ((value>=data[i].prices[k].minVolume/data[i].volumeMultiplicity)&&(value<=data[i].prices[k].maxVolume/data[i].volumeMultiplicity)){
								currency.value = (data[i].prices[k].value * (1- (0.002 * k))).toFixed(2);
								if (currency==usd)
								$("#label_usd").text("$ "+ currency.value)
								else $("#label_eur").text("€ "+currency.value);
								$(".b-payment-sum").text(Math.round((currency.value)*value)+" RUB");
								
								return;
							}
						}
						
					};
				};
				
				
			});
		};

	btnset();
	getCurrency();
	
	
	