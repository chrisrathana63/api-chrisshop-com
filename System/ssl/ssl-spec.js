var fs  = require('fs'),
    ssl = require('../ssl');

var testKeyString = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACAhiE1rHPnqz1g1iDWSSwZpSXaUS2yjvcmp68b6hNASQwAAAKB5/Gb7efxm
+wAAAAtzc2gtZWQyNTUxOQAAACAhiE1rHPnqz1g1iDWSSwZpSXaUS2yjvcmp68b6hNASQw
AAAEB04q7VzjM2Mv0rtJZ33/KhMsC3QtHStwa/wRxfwQFv/iGITWsc+erPWDWINZJLBmlJ
dpRLbKO9yanrxvqE0BJDAAAAFnlvdXJfZW1haWxAZXhhbXBsZS5jb20BAgMEBQYH
-----END OPENSSH PRIVATE KEY-----`;

describe('SSL', function() {

  describe('#removePassphrase', function() {
    it('should execute the correct command with the correct options', function(done) {
      var opts = {
        newKeyName: '/path/to/new.pem',
        informExt: 'TEST',
        outformExt: 'TEST'
      }, cmd = null;

      spyOn(ssl, '_runCommand').and.callFake(function() {
        cmd = arguments[0];
        arguments[1]();
      });

      ssl.removePassphrase('test.pem', 'secret', opts, function() {
        expect(ssl._runCommand).toHaveBeenCalled();
        expect(cmd).toEqual('openssl rsa -passin pass:secret -inform TEST -in test.pem -outform TEST -out /path/to/new.pem');
        done();
      });
    });
  });

  describe('#toDer', function() {
    it('should execute the correct command', function(done) {
      var cmd = null;

      spyOn(ssl, '_runCommand').and.callFake(function() {
        cmd = arguments[0];
        arguments[1]();
      });

      ssl.toDer('test.pem', 'test.der', function() {
        expect(ssl._runCommand).toHaveBeenCalled();
        expect(cmd).toEqual('openssl x509 -in test.pem -outform der -out test.der');
        done();
      });
    });
  });

  describe('#toFile', function() {
    it('should save the string key to a file', function(done) {
      var opts = {
        folderName: __dirname,
        name: 'test',
        ext: '.pem'
      };

      ssl.toFile(testKeyString, opts, function() {
        var filePath = __dirname + '/test.pem';
        var exists = fs.existsSync(filePath);
        expect(exists).toEqual(true);
        fs.unlinkSync(filePath);
        done();
      });
    });
  });

  describe('#toPem', function() {
    it('should execute the correct command', function(done) {
      var cmd = null;

      spyOn(ssl, '_runCommand').and.callFake(function() {
        cmd = arguments[0];
        arguments[1]();
      });

      ssl.toPem('test.crt', 'test.pem', function() {
        expect(ssl._runCommand).toHaveBeenCalled();
        expect(cmd).toEqual('openssl x509 -in test.crt -inform der -text -outform pem -out test.pem');
        done();
      });
    });
  });

  describe('#verify', function() {
    it('should execute the correct command', function(done) {
      var cmd = null;

      spyOn(ssl, '_runCommand').and.callFake(function() {
        cmd = arguments[0];
        arguments[1](null, '', '');
      });

      ssl.verify('test.ca', 'test.pem', function() {
        expect(ssl._runCommand).toHaveBeenCalled();
        expect(cmd).toEqual('openssl verify -CAfile test.ca test.pem');
        done();
      });
    });
  });
});
