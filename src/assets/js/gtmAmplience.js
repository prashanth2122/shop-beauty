function gtmPromoclicks(gtmId, gtmName, gtmCreative, gtmPosition)
{
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
    'event': 'eec.promotionClick',
    'ecommerce': {
        'promoClick': {
        'promotions': [                     
        {
            'id': gtmId,            
            'name':gtmName,
            'creative': gtmCreative,
            'position': gtmPosition

        }]
        }
    }
    });
}