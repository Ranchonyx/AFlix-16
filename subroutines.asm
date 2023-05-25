.section functions:
    .function laxff:
        LAX $caca
        RET
    .endfunction

    .function lbxff:
        LBX $baca
        RET
    .endfunction
.endsection

.section bootstrap:
    SRST
.endsection

.section program:
    JSR "laxff"
    HLT
    JSR "lbxff"
    HLT
.endsection