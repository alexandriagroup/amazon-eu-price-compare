import React from "react"
//import * as amzUtil from "../util/AmazonUtils"

export default class App extends React.Component {
	componentDidMount() {
		this.props.getOptions()
		chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
			if (changeInfo.status == "complete") {
				this.props.getCurrentPageUrl()
			}
		}.bind(this))
		this.props.getCurrencyRate()
		this.props.getCurrentPageUrl()
	}

	render() {
		if (this.props.price.length === 0) {
			return (
				<p>Not amazon product detail page or can't parse price</p>
				)
		}

		var currentCountry = ''

		this.props.price.map(function(amz) {
			if (amz.current == true) {
				currentCountry = amz.country
			}
		})

		var GBPEUR = this.props.rate.GBPEUR
		var EURGBP = this.props.rate.EURGBP
		
		var prices = this.props.price.map(function(amz){
			if (amz.country == 'uk') {
				amz.gbpPrice = amz.price
				amz.eurPrice = (amz.price * GBPEUR).toFixed(2)
				return amz
			} else {
				amz.eurPrice = amz.price
				amz.gbpPrice = (amz.price * EURGBP).toFixed(2)
				return amz	
			}
		})

		prices = prices.sort(function(a, b){
			return a.eurPrice - b.eurPrice
		})

		var showRanks = this.props.options.showRanks
		if (showRanks) {
			var ranks = this.props.rank
			prices = prices.map(function(amz) {
				amz.rank = ranks[amz.country]
				return amz
			})
		}

		const price_list = prices.map(function(amz) {
			return (
				<tr key={amz.country}>
				<td className="amazon">Amazon</td>
				<td className="country">{amz.country.toUpperCase()}</td>
				<td className="price"><a href={amz.url} target="_blank">&euro; {amz.eurPrice}</a></td>
				{currentCountry == 'uk' &&
				<td className="price"><a href={amz.url} target="_blank">&pound; {amz.gbpPrice}</a></td>}
				{showRanks === true &&
					<td className="rank">{amz.rank}</td>}
					</tr>
					)
		})

		return (
			<table className="pricelist">
			<tbody>
			{price_list}
			</tbody>
			</table>
			)
	}
}
