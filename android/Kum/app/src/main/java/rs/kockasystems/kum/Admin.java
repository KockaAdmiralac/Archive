package rs.kockasystems.kum;

import android.content.Intent;
import android.os.Bundle;
import android.app.Activity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.ToggleButton;

import rs.kockasystems.Commons;

public class Admin extends Activity
{
    private EditText name, surname, terms;
    private TextView barcode;
    private ListView listView;
    private ToggleButton toggle;

    @Override
    protected void onCreate(final Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.admin);
        name = (EditText) findViewById(R.id.name);
        surname = (EditText) findViewById(R.id.surname);
        barcode = (TextView) findViewById(R.id.id);
        terms = (EditText) findViewById(R.id.termsToAdd);
        listView = (ListView) findViewById(R.id.usersList);
        listView.setChoiceMode(ListView.CHOICE_MODE_SINGLE);
        listView.setOnItemClickListener(new ListView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id)
            {
                Commons.dialogArguments.putInt("pos", position);
                Commons.startDialog(getFragmentManager(), new DialogUser());
            }
        });
        refreshList();
        toggle = (ToggleButton) findViewById(R.id.toggleButton);
    }

    public void refreshList() { listView.setAdapter(new ArrayAdapter<>(this, R.layout.user_element, Main.database.userNames)); }

    public void buttonScanQR    (final View v)  { Commons.scanQR(this, Commons.QR_PAYMENT_SCAN_REQUEST);    }
    public void buttonScanUserQR(final View v)  { Commons.scanQR(this, Commons.QR_USER_SCAN_REQUEST);       }
    public void buttonAddTerms  (final View v)  { Commons.scanQR(this, Commons.QR_ADD_TERMS_SCAN_REQUEST);  }

    public void buttonRegister(final View v)
    {
        final String nameText = name.getText().toString(), surnameText = surname.getText().toString(), barcodeText = barcode.getText().toString();
        System.out.println(barcodeText);
        if(!nameText.equals("") && !surnameText.equals(""))
        {
            if(Main.database.registerNewUser(nameText, surnameText, barcodeText))
            {
                Commons.toast(this, getString(R.string.success_user_register));
                if(!Main.database.refreshUsers()) Commons.toast(this, Commons.error(this, R.string.error_refresh_users));
                else refreshList();
            }
            else Commons.toast(this, Commons.error(this, R.string.error_register_user));
        }
    }

    @Override
    protected void onActivityResult(final int requestCode, final int resultCode, final Intent data)
    {
        if(resultCode == RESULT_OK) switch(requestCode)
        {
            case Commons.QR_PAYMENT_SCAN_REQUEST:
                final User temp = Main.database.getUserByQR(data.getStringExtra("SCAN_RESULT"));
                if(temp == null) Commons.toast(this, getString(R.string.error_scan_user_nonexistent));
                else
                {
                    if(temp.terms[Commons.month] <= 0) Commons.toast(this, getString(R.string.error_not_enough_terms));
                    else
                    {
                        -- temp.terms[Commons.month];
                        if(Main.database.newCheckout(temp.qr)) Commons.toast(this, Main.database.updateUserTerms(temp.qr, temp.getTerms()) ? getString(R.string.success_update_terms) : Commons.error(this, R.string.error_updating_terms));
                        else Commons.toast(this, Commons.error(this, R.string.error_register_checkout));
                    }
                }
                break;
            case Commons.QR_USER_SCAN_REQUEST:
                barcode.setText(data.getStringExtra("SCAN_RESULT"));
                break;
            case Commons.QR_ADD_TERMS_SCAN_REQUEST:
                try
                {
                    final int termsInt = Integer.parseInt(terms.getText().toString());
                    final String qr = data.getStringExtra("SCAN_RESULT");
                    if(Main.database.newPayment(qr, termsInt)) Commons.toast(this, Main.database.addTerms(qr, toggle.isChecked(), termsInt) ? getString(R.string.success_sessions_add) : Commons.error(this, R.string.error_adding_terms));
                    else Commons.toast(this, Commons.error(this, R.string.error_register_payment));
                }
                catch(final Exception e) { Commons.toast(this, Commons.error(this, R.string.error_adding_terms)); }
                break;
        }
    }
}