package rs.kockasystems.kum;

public class User
{
    public String name, surname, qr;
    public byte[] terms = new byte[12];

    public User(String qr, String name, String surname, String terms)
    {
        this.qr = qr;
        this.name = name;
        this.surname = surname;
        final String[] temp = terms.split(";");
        for (String term: temp) if (!term.equals(""))
        {
            String[] tempSplit = term.split(":");
            this.terms[Integer.parseInt(tempSplit[0])] = Byte.parseByte(tempSplit[1]);
        }
    }

    public String getTerms()
    {
        String temp = "";
        for(int i=0; i<12; ++i) if(terms[i] != 0)temp += i + ":" + terms[i] + ";";
        return temp;
    }
}