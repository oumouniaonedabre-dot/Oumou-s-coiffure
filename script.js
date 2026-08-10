document.addEventListener('DOMContentLoaded', () => {

    const serviceCards = document.querySelectorAll('.service-card');
    const selectedList = document.getElementById('selected-list');
    const totalPriceElement = document.getElementById('total-price');
    const bookingForm = document.getElementById('booking-form');

    let selectedServices = [];

    // Imposta la data minima a oggi nel selettore di data
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Gestione Selezione Servizi
    serviceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Impedisce comportamenti anomali
            e.preventDefault();

            const btn = card.querySelector('.btn-select-service');
            const titleElement = card.querySelector('h3');
            const priceAttr = card.getAttribute('data-price');

            if (!titleElement || !priceAttr) return;

            const title = titleElement.innerText.trim();
            const price = parseFloat(priceAttr);

            // Alterna lo stato selezionato
            const isSelected = card.classList.toggle('selected');

            if (isSelected) {
                if (btn) btn.innerText = 'Selezionato ✓';
                selectedServices.push({ title, price });
            } else {
                if (btn) btn.innerText = 'Seleziona';
                selectedServices = selectedServices.filter(item => item.title !== title);
            }

            updateSummary();
        });
    });

    // Aggiorna il riepilogo nell'interfaccia
    function updateSummary() {
        if (!selectedList || !totalPriceElement) return;

        selectedList.innerHTML = '';
        let total = 0;

        if (selectedServices.length === 0) {
            selectedList.innerHTML = '<li class="empty-msg text-muted">Nessun servizio selezionato. Clicca su una scheda sopra per aggiungerlo.</li>';
        } else {
            selectedServices.forEach(item => {
                total += item.price;
                const li = document.createElement('li');
                li.innerHTML = `<span>${item.title}</span> <strong>€${item.price}</strong>`;
                selectedList.appendChild(li);
            });
        }

        totalPriceElement.innerText = `€${total}`;
    }

    // Invio Prenotazione via WhatsApp
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (selectedServices.length === 0) {
                alert('Per favore, seleziona almeno un servizio prima di procedere.');
                return;
            }

            const name = document.getElementById('userName').value;
            const phone = document.getElementById('userPhone').value;
            const dateRaw = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            const notesInput = document.getElementById('userNotes');
            const notes = notesInput ? notesInput.value : '';

            // Formatta la data in GG/MM/AAAA
            const dateFormatted = dateRaw ? dateRaw.split('-').reverse().join('/') : '';

            const servicesText = selectedServices.map(s => `• ${s.title} (€${s.price})`).join('\n');
            const total = totalPriceElement.innerText;

            // Inserisci qui il tuo numero di cellulare reale con prefisso 39 (es: 393331234567)
            const phoneNumber = "393000000000"; 

            const message = `Ciao Oum's Coiffure! 👋\n\n` +
                            `Sono *${name}* (${phone}) e vorrei prenotare un appuntamento:\n\n` +
                            `📅 *Data:* ${dateFormatted}\n` +
                            `⏰ *Orario:* ${time}\n\n` +
                            `*Servizi scelti:*\n${servicesText}\n\n` +
                            `*Totale stimato:* ${total}\n` +
                            `${notes ? '*Note:* ' + notes : ''}`;

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});