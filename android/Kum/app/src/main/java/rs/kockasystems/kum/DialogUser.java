package rs.kockasystems.kum;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.os.Bundle;

import rs.kockasystems.Commons;

public class DialogUser extends DialogFragment
{
    public Dialog onCreateDialog(Bundle savedInstanceState)
    {
        final int pos = getArguments().getInt("pos");
        return new AlertDialog.Builder(getActivity())
                .setTitle(R.string.user)
                .setItems(R.array.user_dialog_list, new DialogInterface.OnClickListener()
                {
                    @Override
                    public void onClick(DialogInterface dialog, int which)
                    {
                        switch (which)
                        {
                            case 0:
                                Main.database.deleteUser(pos);
                                break;
                            case 1:
                                User tempUser = Main.database.getUserByQR(Main.database.userQRs[pos]);
                                if (tempUser == null) Commons.toast(getActivity(), getActivity().getString(R.string.error_no_user));
                                else
                                {
                                    String tempMessage = "";
                                    String[] tempMonths = getActivity().getResources().getStringArray(R.array.months);
                                    for (int i = 0; i < 12; ++i) if (tempUser.terms[i] != 0) tempMessage += tempMonths[i] + ": " + tempUser.terms[i] + "\n";
                                    DialogFragment tempDf = new DialogDisplay();
                                    final Bundle tempArgs = new Bundle();
                                    tempArgs.putString("message", tempMessage);
                                    tempDf.setArguments(tempArgs);
                                    tempDf.show(getFragmentManager(), "rs.kockasystems.kum.DialogDisplay");
                                }
                                break;
                        }
                    }
                })
                .create();
    }

    @Override
    public void onDismiss(DialogInterface dialog)
    {
        super.onDismiss(dialog);
        final Activity activity = getActivity();
        if (activity instanceof Admin) ((Admin) activity).refreshList();
    }
}