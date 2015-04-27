CLASS({
  name: 'Controller',
  properties: [
    {
      name: 'search',
      view: { factory_: 'foam.ui.TextFieldView', onKeyMode: true }
    },
    {
      name: 'order',
      defaultValue: Phone.NAME,
      view: { factory_: 'foam.ui.ChoiceView', choices: [
        [ Phone.NAME, 'Alphabetical' ],
        [ Phone.AGE,  'Newest' ]
      ] }
    },
    { name: 'dao', defaultValue: phones },    // phones comes from phones.js
                                              // It's an in-memory DAO
                                              // of the phone data
    {
      name: 'filteredDAO',
      model_: 'foam.core.types.DAOProperty',
      view: {
        factory_: 'foam.ui.DAOListView',
        rowView: 'PhoneCitationView',
        mode: 'read-only'
      },
      dynamicValue: function() {
        return this.dao.orderBy(this.order)
            .where(CONTAINS_IC(SEQ(Phone.NAME, Phone.SNIPPET), this.search));
      }
    }
  ]
});

CLASS({
  name: 'PhoneCitationView',
  extendsModel: 'foam.ui.DetailView',
  templates: [
    function toHTML() {/*
      <li class="thumbnail">
        <a href="#{{this.data.id}}" class="thumb">$$imageUrl</a>
        <a href="#{{this.data.id}}">$$name{mode: 'read-only'}</a>
        <p>$$snippet{mode: 'read-only'}</p>
      </li>
    */}
  ]
});

CLASS({
  name: 'ControllerView',
  extendsModel: 'foam.ui.DetailView',
  requires: [
    'PhoneCitationView',
    'foam.ui.TextFieldView',
    'foam.ui.ChoiceView',
    'foam.ui.DAOListView',
    'foam.ui.ImageView'
  ],
  templates: [
    function toHTML() {/*
      <% if ( window.location.hash ) {
        var view = PhoneDetailView.create({ model: Phone });
        this.addChild(view);

        this.data.dao.find(window.location.hash.substring(1), {
          put: function(phone) {
            view.data = phone;
          }
        });

        return view.toHTML();
      } else { %>
        Search: $$search
        Sort by: $$order
        <p>$$filteredDAO{className: 'phones', tagName: 'ul'}</p>
      <% } %>
    */}
  ],
  methods: {
    init: function() {
      this.SUPER();
      window.addEventListener('hashchange', function() {
        document.body.innerHTML = this.toHTML();
        this.initHTML();
      }.bind(this));
    }
  }
});

CLASS({
  name: 'PhoneDetailView',
  extendsModel: 'foam.ui.DetailView',
  templates: [
    { name: 'toHTML' }
  ]
});
