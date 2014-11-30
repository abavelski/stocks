describe('My test', function() {

  beforeEach(function() {
    browser.get('http://localhost:8000');
  });

  it('register new user', function(){
    element(by.id('toolbar-register')).click();
    element(by.model('user.email')).sendKeys('zzz');
    element(by.model('user.firstName')).sendKeys('bla');
    element(by.model('user.lastName')).sendKeys('bla');
    element(by.model('user.password')).sendKeys('1234');
    element(by.id('btn-register')).click();
    expect(element(by.id('thanks')).getText()).toEqual('Thank you for registration.');


  });

  it('login should fail', function() {
    element(by.id('toolbar-login')).click();
    element(by.model('user.username')).sendKeys('zzz');
    element(by.model('user.password')).sendKeys('123');
    element(by.id('btn-login')).click();
    expect(element(by.id('auth-error')).getText()).toEqual('Invalid credentials');
  });

  it('login and add custody', function() {
    element(by.id('toolbar-login')).click();
    element(by.model('user.username')).sendKeys('zzz');
    element(by.model('user.password')).sendKeys('1234');
    element(by.id('btn-login')).click();
    element(by.id('home')).click();
    element(by.model('custody.name')).sendKeys('Custody2');
    element(by.id('add-custody')).click();

    expect(element(by.repeater('custody in custodies')
      .row(1)).element(by.css('a'))
      .getText()).toEqual('Custody2');

  });

});