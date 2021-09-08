/**
  @file
  @brief appends a file from frontend to a user provided location
  @details Returns the file size or -1 in case of error.

  <h4> SAS Macros </h4>
  @li mf_getfilesize.sas
  @li mf_isdir.sas
  @li mp_abort.sas
  @li mp_binarycopy.sas
  @li mp_webin.sas

**/

%mp_abort(iftrue= (%mf_isdir(&path) = 0)
  ,mac=&_program..sas
  ,msg=%str(File path (&path) is not a valid directory)
)

/*
  Straighten up the _webin_xxx variables
*/
%mp_webin()

/* setup the output destination */
%let outloc=&path/&_webin_filename1;
filename fileout "&outloc";

/* send the data in APPEND mode */
%mp_binarycopy(inref=&_webin_fileref1, outref=fileout, mode=APPEND)

%mp_abort(iftrue= (&syscc ge 4)
  ,mac=&_program..sas
  ,msg=%str(Error occurred reading &_webin_fileref1 and writing to &outloc)
)

/* success - lets create a directory listing */
data fromsas;
  filesize="%mf_getfilesize(fpath=&path/&_webin_filename1,format=yes)";
run;

/* now send it back to the frontend */
%webout(OPEN)
%webout(OBJ,fromsas)
%webout(CLOSE)
