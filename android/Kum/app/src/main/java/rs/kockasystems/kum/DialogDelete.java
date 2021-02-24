package rs.kockasystems.kum;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.os.Bundle;

import rs.kockasystems.Commons;

public class DialogDelete extends DialogFragment
{
    public Dialog onCreateDialog(Bundle savedInstanceState)
    {
        return new AlertDialog.Builder(getActivity())
                .setTitle(R.string.deletion)
                .setPositiveButton(R.string.yes, new DialogInterface.OnClickListener()
                {
                    @Override
                    public void onClick(DialogInterface dialog, int which)
                    {
                        Commons.toast(getActivity(), Main.database.deleteAdmin(getArguments().getString("adminName")) ? getString(R.string.success_admin_delete) : Commons.error(getActivity(), R.string.error_delete_admin));
                    }
                })
                .setNegativeButton(R.string.no, new DialogInterface.OnClickListener(){ public void onClick(DialogInterface dialog, int which) { } })
                .setMessage(R.string.prompt_delete_admin)
                .create();
    }

    @Override
    public void onDismiss(DialogInterface dialog)
    {
        super.onDismiss(dialog);
        final Activity activity = getActivity();
        if (activity instanceof Register) ((Register) activity).refreshList();
    }
}